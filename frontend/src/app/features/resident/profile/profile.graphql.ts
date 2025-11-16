import { gql } from 'apollo-angular';

export const UPDATE_MY_PROFILE = gql`
  mutation UpdateMyProfile($input: UpdateProfileInput!) {
    updateMyProfile(input: $input) {
      id
      firstName
      lastName
      email
      phone
    }
  }
`;
