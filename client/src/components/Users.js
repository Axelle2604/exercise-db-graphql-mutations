import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { query, addUsersWithAddress } from '../services/userQuery';

class Users extends Component {
  state = {
    name: '',
    password: '',
    number: '',
    street: '',
    town: '',
    postalCode: '',
  };

  onChangeInput = (inputName, { target: { value } }) => {
    this.setState({ [inputName]: value });
  };

  createUser = () => {
    const { addUsersWithAddress } = this.props;
    const { number, postalCode, ...others } = this.state;
    addUsersWithAddress({
      variables: {
        ...others,
        number: parseInt(number, 10),
        postalCode: parseInt(postalCode, 10),
      },
      refetchQueries: [{ query }],
    });
  };

  render() {
    const { getUsers: { users = [] } = {} } = this.props;
    const displayUsers =
      users &&
      users.map(({ name, id, password, address }) => (
        <li key={id}>
          <span>
            {name} | {password} | {address && address.number} |
            {address && address.street} | {address && address.town} |
            {address && address.postalCode}
          </span>
        </li>
      ));
    return (
      <div>
        <h1>Users</h1>
        <ul>{displayUsers}</ul>
        <div>
          <h3>Add User & Address</h3>
          <input
            type="text"
            placeholder="name"
            onChange={this.onChangeInput.bind(this, 'name')}
          />
          <input
            type="text"
            placeholder="password"
            onChange={this.onChangeInput.bind(this, 'password')}
          />
        </div>
        <br />
        <div>
          <input
            type="text"
            placeholder="number"
            onChange={this.onChangeInput.bind(this, 'number')}
          />
          <input
            type="text"
            placeholder="street"
            onChange={this.onChangeInput.bind(this, 'street')}
          />
          <input
            type="text"
            placeholder="town"
            onChange={this.onChangeInput.bind(this, 'town')}
          />
          <input
            type="text"
            placeholder="postalCode"
            onChange={this.onChangeInput.bind(this, 'postalCode')}
          />
        </div>
        <br />
        <div>
          <button onClick={this.createUser}>Create</button>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(query, { name: 'getUsers' }),
  graphql(addUsersWithAddress, { name: 'addUsersWithAddress' })
)(Users);
