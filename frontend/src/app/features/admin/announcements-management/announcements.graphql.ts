import { gql } from 'apollo-angular';

export const GET_ADMIN_ANNOUNCEMENTS = gql`
  query GetAdminAnnouncements($page: Int, $size: Int) {
    adminAnnouncements(page: $page, size: $size) {
      content {
        id
        title
        content
        category
        startDate
        endDate
        buildings {
          id
          name
        }
        createdAt
        updatedAt
      }
      totalElements
      totalPages
      currentPage
    }
  }
`;

export const CREATE_ANNOUNCEMENT = gql`
  mutation CreateAnnouncement($input: CreateAnnouncementInput!) {
    createAnnouncement(input: $input) {
      id
      title
      content
      category
      startDate
      endDate
      buildings {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ANNOUNCEMENT = gql`
  mutation UpdateAnnouncement($id: ID!, $input: UpdateAnnouncementInput!) {
    updateAnnouncement(id: $id, input: $input) {
      id
      title
      content
      category
      startDate
      endDate
      buildings {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_ANNOUNCEMENT = gql`
  mutation DeleteAnnouncement($id: ID!) {
    deleteAnnouncement(id: $id)
  }
`;


