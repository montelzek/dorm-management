import { gql } from 'apollo-angular';

export const GET_RESIDENT_DASHBOARD = gql`
  query GetResidentDashboard {
    residentDashboard {
      userInfo {
        id
        firstName
        lastName
        email
        phone
        roomNumber
        buildingName
      }
      stats {
        totalReservations
        totalIssues
        activeListings
      }
      myActiveReservations {
        id
        startTime
        endTime
        status
        resource {
          id
          name
          resourceType
        }
        user {
          id
          firstName
          lastName
          role
          building {
            id
            name
          }
        }
      }
      myIssues {
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
      upcomingEvents {
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
      }
      activeAnnouncements {
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
      }
      myActiveListings {
        id
        title
        description
        listingType
        category
        price
        imageFilenames
        contactInfo {
          email
          phone
          firstName
          lastName
        }
        createdAt
        updatedAt
        isOwnListing
      }
    }
  }
`;


