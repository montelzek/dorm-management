import { gql } from 'apollo-angular';

export const GET_MY_ISSUES = gql`
  query GetMyIssues($status: String) {
    myIssues(status: $status) {
      id
      title
      description
      status
      priority
      createdAt
      updatedAt
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

export const CREATE_ISSUE = gql`
  mutation CreateIssue($input: CreateIssueInput!) {
    createIssue(input: $input) {
      id
      title
      description
      status
      priority
      createdAt
      updatedAt
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

export const CANCEL_ISSUE = gql`
  mutation CancelIssue($issueId: ID!) {
    cancelIssue(issueId: $issueId)
  }
`;

