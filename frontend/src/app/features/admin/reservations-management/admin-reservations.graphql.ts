import {gql} from 'apollo-angular';

export const GET_ADMIN_RESERVATIONS = gql`
  query GetAdminReservations($page: Int, $size: Int, $sortDirection: String, $resourceId: ID, $buildingId: ID, $date: String, $search: String) {
    adminReservations(page: $page, size: $size, sortDirection: $sortDirection, resourceId: $resourceId, buildingId: $buildingId, date: $date, search: $search) {
      content {
        id
        firstName
        lastName
        userBuildingName
        userRoomNumber
        resourceName
        resourceBuildingName
        startTime
        endTime
        date
        status
      }
      totalElements
      totalPages
      currentPage
      pageSize
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

export const GET_RESOURCES = gql`
  query GetResources($buildingId: ID!) {
    resourcesByBuilding(buildingId: $buildingId) {
      id
      name
      resourceType
    }
  }
`;

export const CANCEL_RESERVATION_ADMIN = gql`
  mutation CancelReservationAdmin($reservationId: ID!) {
    cancelReservation(reservationId: $reservationId)
  }
`;

