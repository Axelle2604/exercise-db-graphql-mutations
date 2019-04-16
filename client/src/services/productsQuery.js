import { gql } from 'apollo-boost';
export const productsQuery = gql`
  {
    products {
      id
      title
      price
    }
  }
`;
export const usersQuery = gql`
  {
    users {
      id
      name
    }
  }
`;
export const ordersProductsQuery = gql`
  {
    orders_products {
      order_id
      product_id
    }
  }
`;
export const addOrder = gql`
  mutation($date: String!, $totalHT: Int!, $userId: Int!, $productId: [Int]!) {
    addOrder(
      date: $date
      totalHT: $totalHT
      userId: $userId
      productId: $productId
    ) {
      date
      totalHT
      userId
    }
  }
`;