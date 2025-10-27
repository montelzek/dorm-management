import { gql } from 'apollo-angular';

export const GET_ADMIN_DASHBOARD = gql`
  query GetAdminDashboard {
    adminDashboard {
      stats {
        totalResidents
        totalRooms
        totalBuildings
        occupiedRooms
        availableRooms
        totalReservations
        totalIssues
      }
      issueStats {
        reported
        inProgress
        resolved
        lowPriority
        mediumPriority
        highPriority
      }
      recentIssues {
        id
        title
        status
        priority
        userName
        buildingName
        createdAt
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
      recentReservations {
        id
        userName
        resourceName
        buildingName
        startTime
        endTime
        status
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
    }
  }
`;


