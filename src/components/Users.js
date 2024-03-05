import { useState, useEffect } from "react";

const Users = () => {
  const [items, setItems] = useState(null);
  const [resourseType, setResourseType] = useState("users");
  
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/${resourseType}`)
      .then((response) => response.json())
      .then((items) => setItems( items ))
      .catch((error) => console.error("Error:", error));
  }, [resourseType]);

  useEffect(() => {
    console.log(items);
  }, [items]);

  function setResourseUsers() {
    setResourseType("users");
  }
  function setResoursePosts() {
    setResourseType("posts");
  }
  return (
    <>
      <h1>Users</h1>
      <button onClick={setResourseUsers}>Users</button>
      <button onClick={setResoursePosts}>Posts</button>
      {items ? (
        items.map((item) => (
          <div key={item.id}>
            <p>{JSON.stringify(item.name || item.body)}</p>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Users;
