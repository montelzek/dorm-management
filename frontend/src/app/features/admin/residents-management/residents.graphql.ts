import {gql} from 'apollo-angular';

export const GET_ALL_RESIDENTS = gql`
  query GetAllResidents {
    allResidents {
      id
      firstName
      lastName
      phone
      buildingName
      roomNumber
    }
  }
`;
