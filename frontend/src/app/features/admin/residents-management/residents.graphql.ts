import {gql} from 'apollo-angular';

export const GET_BUILDINGS = gql`
  query GetBuildings {
    allBuildings {
      id
      name
    }
  }
`;

export const GET_ALL_RESIDENTS = gql`
  query GetAllResidents {
    allResidents {
      id
      firstName
      lastName
      email
      phone
      buildingName
      buildingId
      roomNumber
      roomId
    }
  }
`;

export const GET_RESIDENTS_BY_BUILDING = gql`
  query GetResidentsByBuilding($buildingId: ID!) {
    residentsByBuilding(buildingId: $buildingId) {
      id
      firstName
      lastName
      email
      phone
      buildingName
      buildingId
      roomNumber
      roomId
    }
  }
`;
