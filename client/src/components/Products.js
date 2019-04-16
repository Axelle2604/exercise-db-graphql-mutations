import React from 'react';

const Products = ({ data: { products } }) => {
  return (
    <div>
      <h1>Products</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {products &&
            products.map(({ title, id, description, price, image }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{title}</td>
                <td>{description}</td>
                <td>{price}</td>
                <td>{image}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
