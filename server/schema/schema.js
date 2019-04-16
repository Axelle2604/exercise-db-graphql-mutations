const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
} = require('graphql');

const {
  getUser,
  getUsers,
  getAddressByUserId,
  getOrderByUserId,
  getProductByOrderId,
  getAddressById,
  addUser,
  getProducts,
  getOrders,
  addUsersWithAddress,
  addOrder,
  getOrdersProducts,
} = require('../services/calls');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    password: { type: GraphQLString },
    address: {
      type: AddressType,
      resolve: async ({ id }) => await getAddressByUserId(id),
    },
    order: {
      type: OrderType,
      resolve: async ({ id }) => await getOrderByUserId(id),
    },
  }),
});

const AddressType = new GraphQLObjectType({
  name: 'Address',
  fields: () => ({
    id: { type: GraphQLID },
    number: { type: GraphQLInt },
    street: { type: GraphQLString },
    town: { type: GraphQLString },
    postalCode: { type: GraphQLInt },
    userId: { type: GraphQLInt },
  }),
});

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLInt },
    image: { type: GraphQLString },
  }),
});

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id: { type: GraphQLID },
    date: { type: GraphQLString },
    totalHT: { type: GraphQLInt },
    userId: { type: GraphQLInt },
    product: {
      type: ProductType,
      resolve: async ({ id }) => await getProductByOrderId(id),
    },
  }),
});

const OrderProductType = new GraphQLObjectType({
  name: 'OrderProductType',
  fields: () => ({
    order_id: { type: GraphQLInt },
    product_id: { type: GraphQLInt },
  }),
});

const addUsersWithAddressMutation = {
  type: UserType,
  args: {
    name: { type: GraphQLString },
    password: { type: GraphQLString },
    number: { type: GraphQLInt },
    street: { type: GraphQLString },
    town: { type: GraphQLString },
    postalCode: { type: GraphQLInt },
  },
  resolve: async (
    parent,
    { name, password, number, street, town, postalCode }
  ) => {
    return await addUsersWithAddress(
      name,
      password,
      number,
      street,
      town,
      postalCode
    );
  },
};

const addOrderMutation = {
  type: OrderType,
  args: {
    date: { type: GraphQLString },
    totalHT: { type: GraphQLInt },
    userId: { type: GraphQLInt },
    productId: { type: new GraphQLList(GraphQLInt) },
  },
  resolve: async (parent, { date, totalHT, userId, productId }) => {
    const t = await addOrder(date, totalHT, userId, productId);
    return t;
  },
};

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUsersWithAddress: addUsersWithAddressMutation,
    addOrder: addOrderMutation,
  },
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: async (parents, { id }) => await getUser(id),
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => await getUsers(),
    },
    address: {
      type: AddressType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: async (parents, { id }) => await getAddressById(id),
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve: async () => await getProducts(),
    },
    orders: {
      type: new GraphQLList(OrderType),
      resolve: async () => await getOrders(),
    },
    orders_products: {
      type: new GraphQLList(OrderProductType),
      resolve: async () => await getOrdersProducts(),
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutation,
});
