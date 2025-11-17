import { gql } from 'apollo-angular';

export const GET_MY_ASSIGNED_TASKS = gql`
  query GetMyAssignedTasks($page: Int, $size: Int, $status: String) {
    myAssignedTasks(page: $page, size: $size, status: $status) {
      content {
        id
        title
        description
        status
        priority
        createdAt
        updatedAt
        user {
          id
          firstName
          lastName
        }
        room {
          id
          roomNumber
        }
        building {
          id
          name
        }
      }
      totalElements
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_MY_TASKS_HISTORY = gql`
  query GetMyTasksHistory($page: Int, $size: Int, $buildingId: ID) {
    myTasksHistory(page: $page, size: $size, buildingId: $buildingId) {
      content {
        id
        title
        description
        status
        priority
        createdAt
        updatedAt
        user {
          id
          firstName
          lastName
        }
        room {
          id
          roomNumber
        }
        building {
          id
          name
        }
      }
      totalElements
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_TECHNICIAN_DASHBOARD_STATS = gql`
  query GetTechnicianDashboardStats {
    technicianDashboardStats {
      activeTasks
      resolvedTasks
      inProgressTasks
      reportedTasks
      highPriorityTasks
      urgentPriorityTasks
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($issueId: ID!, $status: String!) {
    updateTaskStatus(issueId: $issueId, status: $status) {
      id
      title
      description
      status
      priority
      createdAt
      updatedAt
      user {
        id
        firstName
        lastName
      }
      room {
        id
        roomNumber
      }
      building {
        id
        name
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
