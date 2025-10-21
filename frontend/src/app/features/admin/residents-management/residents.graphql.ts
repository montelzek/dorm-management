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
  query GetAllResidents($page: Int, $size: Int) {
    allResidents(page: $page, size: $size) {
      content {
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
      totalElements
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_RESIDENTS_BY_BUILDING = gql`
  query GetResidentsByBuilding($buildingId: ID!, $page: Int, $size: Int) {
    residentsByBuilding(buildingId: $buildingId, page: $page, size: $size) {
      content {
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
      totalElements
      totalPages
      currentPage
      pageSize
    }
  }
`;
