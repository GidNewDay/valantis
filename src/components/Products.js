import { useEffect, useState } from "react";
import md5 from "md5";
import classes from "./Products.module.css";
import FormFilter from "./FormFilter";

const Products = () => {
  const limitOnPage = 50;
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [params, setParams] = useState({
    action: "get_ids",
    params: { offset: page, limit: limitOnPage },
  });
  const [products, setProducts] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      const t = new Date();
      const timestamp = t.toISOString().split("T")[0].replace(/-/g, "");
      const authString = md5(`Valantis_${timestamp}`);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.valantis.store:41000/", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("X-Auth", authString);

      setIsLoading(true);
      xhr.onreadystatechange = async () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {setIsLoading(false);
          if (xhr.status === 200) {
            let res = await JSON.parse(xhr.responseText);

            if (params.action === "get_items") {
          
              //Если API возвращает дубли по id, то следует их считать одним товаром и выводить только первый.
              const uniqueProducts = res.result.reduce((acc, item) => {
                if (!acc[item.id]) {
                  acc[item.id] = item;
                }
                return acc;
              }, {});

              const uniqueProductsArray = Object.values(uniqueProducts);

              //Сохраняем список продуктов
              setProducts(uniqueProductsArray);
            } else {
              setData(res.result);
            }
          } else {
            console.error("Ошибка:", xhr.status, xhr.statusText);
          }
        }
      };

      xhr.send(JSON.stringify(params));
    };

    fetchData();
  }, [params]);

  useEffect(() => {
    data &&
      setParams({
        action: "get_items",
        params: {
          ids: data,
        },
      });
  }, [data]);

  // << Назад
  function prevPage() {
    setPage(page - limitOnPage);
    setParams({
      action: "get_ids",
      params: { offset: page - limitOnPage, limit: limitOnPage },
    });
    // console.log(page, page + limitOnPage);
  }

  // Вперед >>
  function nextPage() {
    setPage(page + limitOnPage);
    setParams({
      action: "get_ids",
      params: { offset: page + limitOnPage, limit: limitOnPage },
    });
  }

  // Действия при изменении данных в форме фильтра
  useEffect(() => {
    if (formData) {
      let filterParams =
        formData.filterType === "product"
          ? { product: formData.filterValue }
          : formData.filterType === "price"
          ? { price: Number(formData.filterValue) }
          : formData.filterType === "brand"
          ? { brand: formData.filterValue }
          : {};

      setParams({
        action: "filter",
        params: filterParams,
      });
    }
  }, [formData]);

  //Функция при отправке формы фильтра
  const handleFormSubmit = (f_data) => {
    setIsLoading(true);
    setFormData(f_data);
  };

  return (
    <>
      <h1>Список товаров</h1>
      <FormFilter onSubmit={handleFormSubmit} />
      <div className={classes["btn-group"]}>
        <button onClick={prevPage}>&laquo; Назад</button>
        <button onClick={nextPage}>Вперёд &raquo;</button>
      </div>

      {!isLoading && products ? (
        <div className={classes.table}>
          <div className={classes.thead}>
            <div className={classes.tr}>
              <div>ID</div>
              <div>Название</div>
              <div>Цена</div>
              <div>Бренд</div>
            </div>
          </div>
          <div className={classes.tbody}>
            {products.map((product) => (
              <div key={product.id} className={classes.tr}>
                <div>
                  <span>ID: </span>
                  {product.id}
                </div>
                <div>
                  <span>Название: </span>
                  {product.product}
                </div>
                <div>
                  <span>Цена:</span> {product.price}{" "}
                </div>
                <div>
                  <span>Бренд:</span> {product.brand}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Загрузка...</p>
      )}
    </>
  );
};

export default Products;
