import { useState } from "react";
import classes from "./FormFilter.module.css";

export default function FormFilter({ onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <select
        name="filterType"
        className={classes.input}
        onChange={handleChange}
      >
        <option value="">Выберите фильтр</option>
        <option value="product">Название</option>
        <option value="price">Цена</option>
        <option value="brand">Бренд</option>
      </select>
      <input
        type="text"
        name="filterValue"
        value={formData.filterValue}
        onChange={handleChange}
        className={classes.input}
      />
      {/* <label htmlFor="product">Название</label>
      <input
        type="text"
        name="product"
        value={formData.product}
        onChange={handleChange}
      />

      <label htmlFor="price">Цена</label>
      <input
        type="text"
        name="price"
        value={formData.price}
        onChange={handleChange}
      />

      <label htmlFor="brand">Бренд</label>
      <input
        type="text"
        name="brand"
        value={formData.brand}
        onChange={handleChange}
      /> */}

      <button type="button" onClick={handleSubmit}>
        Применить фильтр
      </button>
    </form>
  );
}
