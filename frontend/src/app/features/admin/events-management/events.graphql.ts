import { gql } from 'apollo-angular';

// Events Queries
export const GET_ADMIN_EVENTS = gql`
  query GetAdminEvents($page: Int, $size: Int, $buildingId: ID, $startDate: String, $endDate: String) {
    adminEvents(page: $page, size: $size, buildingId: $buildingId, startDate: $startDate, endDate: $endDate) {
      content {
        id
        title
        description
        eventDate
        startTime
        endTime
        building {
          id
          name
        }
        resource {
          id
          name
        }
        createdAt
        updatedAt
      }
      totalElements
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_RESIDENT_EVENTS = gql`
  query GetResidentEvents($startDate: String!, $endDate: String!) {
    residentEvents(startDate: $startDate, endDate: $endDate) {
      id
      title
      description
      eventDate
      startTime
      endTime
      building {
        id
        name
      }
      resource {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

// Events Mutations
export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      title
      description
      eventDate
      startTime
      endTime
      building {
        id
        name
      }
      resource {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      id
      title
      description
      eventDate
      startTime
      endTime
      building {
        id
        name
      }
      resource {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`;

