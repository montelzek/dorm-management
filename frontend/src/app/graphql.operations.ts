import { gql } from 'apollo-angular';


export const GET_MY_DETAILS = gql`
  query GetMyDetails {
    me {
      id
      firstName
      lastName
      building {
        id
        name
      }
      room {
        id
        roomNumber
      }
    }
  }
`;

export const GET_BUILDINGS = gql`
  query GetBuildings {
    allBuildings {
      id
      name
    }
  }
`;

export const GET_RESOURCES_BY_BUILDING = gql`
  query GetResourcesByBuilding($buildingId: ID!) {
    resourcesByBuilding(buildingId: $buildingId) {
      id
      name
      resourceType
    }
  }
`;

export const GET_AVAILABLE_LAUNDRY_SLOTS = gql`
  query GetAvailableLaundrySlots($resourceId: ID!, $date: String!) {
    availableLaundrySlots(resourceId: $resourceId, date: $date) {
      startTime
      endTime
    }
  }
`;

export const GET_MY_RESERVATIONS = gql`
  query GetMyReservations {
    myReservations {
      id
      startTime
      endTime
      status
      resource {
        id
        name
      }
    }
  }
`;


export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      id
      startTime
      endTime
    }
  }
`;
