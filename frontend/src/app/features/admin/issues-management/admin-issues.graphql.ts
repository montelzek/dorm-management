import { gql } from 'apollo-angular';

export const GET_ALL_ISSUES = gql`
  query GetAllIssues($page: Int, $size: Int, $status: String, $priority: String, $buildingId: ID) {
    allIssues(page: $page, size: $size, status: $status, priority: $priority, buildingId: $buildingId) {
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

export const UPDATE_ISSUE_STATUS = gql`
  mutation UpdateIssueStatus($issueId: ID!, $status: String!) {
    updateIssueStatus(issueId: $issueId, status: $status) {
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

