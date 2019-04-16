import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { compose, graphql } from 'react-apollo';
import {
  ordersProductsQuery,
  usersQuery,
  productsQuery,
  addOrder,
} from '../services/productsQuery';

const addOrderId = productObj => ({ productsObj }) => ({
  productsObj: [...productsObj, productObj],
});

class Orders extends Component {
  state = {
    userId: null,
    productsObj: [],
  };

  onClickUser = userId => {
    this.setState({ userId });
  };

  onClickProduct = (id, price) => {
    this.setState(addOrderId({ id, price }));
  };

  onClickPurchase = () => {
    const { addOrder } = this.props;
    const { userId, productsObj } = this.state;
    const productsPrice = productsObj.reduce((price, product) =>price + product.price, 0);
    const productsId = productsObj.reduce((idProducts, product) => {
      return [...idProducts, parseInt(product.id, 10)];
    }, []);

    addOrder({
      variables: {
        date: Date.now().toString(10),
        totalHT: parseInt(productsPrice, 10),
        userId: parseInt(userId, 10),
        productId: productsId,
      },
      refetchQueries: [{ query: ordersProductsQuery }],
    });
  };

  render() {
    const {
      getUsers: { users = [] } = {},
      getProducts: { products = [] } = {},
      getOrdersProducts: { orders_products = [] } = {},
    } = this.props;
    const { productsObj, userId } = this.state;
    return (
      <div>
        <h1>Orders</h1>
        <h4>Users</h4>
        <div>
          {users.map(({ id, name }) => (
            <button key={id} onClick={this.onClickUser.bind(this, id)}>
              {name}
            </button>
          ))}
        </div>
        <h4>Products</h4>
        <div>
          {products.map(({ id, title, price }) => (
            <button
              key={id}
              onClick={this.onClickProduct.bind(this, id, price)}
            >
              {title} | {price}
            </button>
          ))}
        </div>
        <h4>Selected User & Products</h4>
        <div>
          <ul>
            <li>{userId}</li>
            {productsObj.map(({ id }) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
        <button onClick={this.onClickPurchase}>Purchase</button>
        <div>
          <h3>ORDERS PRODUCTS</h3>
          {orders_products.map(({ order_id, product_id }) => {
            return (
              <div key={order_id + ' ' + product_id}>
                <span>ORDER ID : {order_id}</span> |
                <span>PRODUCT ID : {product_id}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(usersQuery, { name: 'getUsers' }),
  graphql(productsQuery, { name: 'getProducts' }),
  graphql(ordersProductsQuery, { name: 'getOrdersProducts' }),
  graphql(addOrder, { name: 'addOrder' })
)(Orders);
