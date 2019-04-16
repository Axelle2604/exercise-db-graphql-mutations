import { gql } from 'apollo-boost';
export const query = gql`
  {
    users {
      id
      name
      password
      address {
        number
        street
        town
        postalCode
      }
    }
  }
`;
export const addUsersWithAddress = gql`
  mutation(
    $name: String!
    $password: String!
    $number: Int!
    $street: String!
    $town: String!
    $postalCode: Int!
  ) {
    addUsersWithAddress(
      name: $name
      password: $password
      number: $number
      street: $street
      town: $town
      postalCode: $postalCode
    ) {
      name
      password
    }
  }
`;
