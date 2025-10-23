import { gql } from 'apollo-angular';

// Buildings Queries
export const GET_ADMIN_BUILDINGS = gql`
  query GetAdminBuildings($page: Int, $size: Int) {
    adminBuildings(page: $page, size: $size) {
      content {
        id
        name
        address
        roomsCount
        resourcesCount
        createdAt
      }
      totalElements
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_BUILDING_DETAILS = gql`
  query GetBuildingDetails($id: ID!) {
    buildingDetails(id: $id) {
      id
      name
      address
      roomsCount
      resourcesCount
      createdAt
      updatedAt
    }
  }
`;

// Buildings Mutations
export const CREATE_BUILDING = gql`
  mutation CreateBuilding($input: CreateBuildingInput!) {
    createBuilding(input: $input) {
      id
      name
      address
      roomsCount
      resourcesCount
      createdAt
    }
  }
`;

export const UPDATE_BUILDING = gql`
  mutation UpdateBuilding($id: ID!, $input: UpdateBuildingInput!) {
    updateBuilding(id: $id, input: $input) {
      id
      name
      address
      roomsCount
      resourcesCount
      createdAt
    }
  }
`;

export const DELETE_BUILDING = gql`
  mutation DeleteBuilding($id: ID!) {
    deleteBuilding(id: $id)
  }
`;

// Rooms Queries
export const GET_ADMIN_ROOMS = gql`
  query GetAdminRooms($page: Int, $size: Int, $buildingId: ID, $status: String) {
    adminRooms(page: $page, size: $size, buildingId: $buildingId, status: $status) {
      content {
        id
        roomNumber
        buildingId
        buildingName
        capacity
        occupancy
        rentAmount
        createdAt
      }
      totalElements
      totalPages
      currentPage
      pageSize
    }
  }
`;

// Rooms Mutations
export const CREATE_ROOM = gql`
  mutation CreateRoom($input: CreateRoomInput!) {
    createRoom(input: $input) {
      id
      roomNumber
      buildingId
      buildingName
      capacity
      occupancy
      rentAmount
      createdAt
    }
  }
`;

export const UPDATE_ROOM = gql`
  mutation UpdateRoom($id: ID!, $input: UpdateRoomInput!) {
    updateRoom(id: $id, input: $input) {
      id
      roomNumber
      buildingId
      buildingName
      capacity
      occupancy
      rentAmount
      createdAt
    }
  }
`;

export const DELETE_ROOM = gql`
  mutation DeleteRoom($id: ID!) {
    deleteRoom(id: $id)
  }
`;

// Resources Queries
export const GET_ADMIN_RESOURCES = gql`
  query GetAdminResources($page: Int, $size: Int, $buildingId: ID, $isActive: Boolean) {
    adminReservationResources(page: $page, size: $size, buildingId: $buildingId, isActive: $isActive) {
      content {
        id
        name
        description
        resourceType
        buildingId
        buildingName
        isActive
        createdAt
      }
      totalElements
      totalPages
      currentPage
      pageSize
    }
  }
`;

// Resources Mutations
export const CREATE_RESOURCE = gql`
  mutation CreateResource($input: CreateResourceInput!) {
    createReservationResource(input: $input) {
      id
      name
      description
      buildingId
      buildingName
      isActive
      createdAt
    }
  }
`;

export const UPDATE_RESOURCE = gql`
  mutation UpdateResource($id: ID!, $input: UpdateResourceInput!) {
    updateReservationResource(id: $id, input: $input) {
      id
      name
      description
      buildingId
      buildingName
      isActive
      createdAt
    }
  }
`;

export const TOGGLE_RESOURCE_STATUS = gql`
  mutation ToggleResourceStatus($id: ID!) {
    toggleResourceStatus(id: $id) {
      id
      name
      description
      buildingId
      buildingName
      isActive
      createdAt
    }
  }
`;

// Get all buildings for dropdowns
export const GET_ALL_BUILDINGS = gql`
  query GetAllBuildings {
    allBuildings {
      id
      name
    }
  }
`;

