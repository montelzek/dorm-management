import { gql } from 'apollo-angular';

export const LOGIN_MUTATION = gql`
  mutation LoginUser($loginInput: LoginInput!) {
    loginUser(loginInput: $loginInput) {
      token
      id
      email
      firstName
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation RegisterUser($registerInput: RegisterInput!) {
    registerUser(registerInput: $registerInput) {
      message
    }
  }
`;
