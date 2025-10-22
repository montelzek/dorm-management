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
  query GetAllResidents($page: Int, $size: Int, $search: String, $sortBy: String, $sortDirection: String) {
    allResidents(page: $page, size: $size, search: $search, sortBy: $sortBy, sortDirection: $sortDirection) {
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
  query GetResidentsByBuilding($buildingId: ID!, $page: Int, $size: Int, $search: String, $sortBy: String, $sortDirection: String) {
    residentsByBuilding(buildingId: $buildingId, page: $page, size: $size, search: $search, sortBy: $sortBy, sortDirection: $sortDirection) {
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

export const GET_AVAILABLE_ROOMS = gql`
  query GetAvailableRooms($buildingId: ID) {
    availableRooms(buildingId: $buildingId) {
      id
      roomNumber
      capacity
      currentOccupancy
      rentAmount
      buildingId
      buildingName
    }
  }
`;

export const ASSIGN_ROOM = gql`
  mutation AssignRoom($userId: ID!, $roomId: ID!) {
    assignRoom(userId: $userId, roomId: $roomId) {
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

export const DELETE_RESIDENT = gql`
  mutation DeleteResident($userId: ID!) {
    deleteResident(userId: $userId)
  }
`;
