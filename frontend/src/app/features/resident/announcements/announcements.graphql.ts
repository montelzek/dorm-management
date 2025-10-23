import { gql } from 'apollo-angular';

export const GET_RESIDENT_ANNOUNCEMENTS = gql`
  query GetResidentAnnouncements {
    residentAnnouncements {
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


