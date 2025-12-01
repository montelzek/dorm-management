# MyDorm 🏠

> A comprehensive full-stack web application for managing student dormitories. Built with modern technologies to streamline dormitory operations, resident management, facilities reservations, maintenance requests, events, announcements, and marketplace functionality.

## Project Status

**🚧 Work in Progress**

### Implemented Features
- User authentication and authorization (JWT)
- Role-based access control (Admin, Resident, Technician)
- Admin, Resident, and Technician dashboards with statistics
- User management with room assignments
- Facility management (buildings, rooms, resources, room standards)
- Room standards with occupancy-based pricing
- Facility reservations with availability checking
- Issue reporting and tracking
- Technician assignment and task management
- Event management
- Announcements system
- Marketplace listings with image uploads
- Internationalization (Polish/English)

### In Progress / Planned Features
- Email notifications
- Finance center (rent payments and history)
- Package management system
- Visitor management

## Overview

MyDorm is a dormitory management system designed to automate and simplify the operations of student housing facilities. The application provides role-based access control with dedicated interfaces for residents, administrators, and technicians. It handles everything from room assignments and facility reservations to maintenance tracking, event management, and a built-in marketplace for students.

### Key Capabilities

- **User Management**: Complete resident lifecycle management with role-based access (Admin, Resident, Technician)
- **Facility Management**: Buildings, rooms, resources, and room standards with dynamic pricing
- **Reservations**: Book rooms and resources (laundry, common spaces) with availability checking
- **Maintenance Tracking**: Issue reporting and resolution workflow with technician assignment
- **Event Management**: Create and manage dormitory events with calendar integration
- **Announcements**: Building-specific announcements and notifications
- **Marketplace**: Buy/sell platform for residents with image support
- **Dashboard Analytics**: Real-time statistics and insights for all user roles

## ✨ Features

### User Roles

The system supports three distinct user roles, each with tailored functionality:

#### 👤 Resident
- **Personal Dashboard**: Overview of personal statistics, reservations, and issues
  - Statistics: total reservations and issues
  - My active reservations
  - My issues with status tracking
  - Upcoming events
  - Active announcements
- **Reservations Management**:
  - Create new reservations for available resources
  - View and manage own reservations
  - Filter by status (Pending, Confirmed, Cancelled)
  - Cancel reservations
- **Issues (Maintenance Requests)**:
  - Report new maintenance issues
  - Track status of reported issues (REPORTED, IN_PROGRESS, RESOLVED)
  - Set priority levels (LOW, MEDIUM, HIGH, URGENT)
  - Filter by status and priority
- **Events**:
  - Browse upcoming dormitory events
  - View event details (date, location, description)
- **Announcements**:
  - View active announcements
  - Building-specific and general announcements
- **Marketplace**:
  - Browse marketplace listings
  - Create listings (buy/sell) with images
  - Manage own listings
  - Contact other residents

#### 👨‍💼 Administrator
- **Admin Dashboard**: Comprehensive overview of facility operations
  - Statistics: total residents, rooms, buildings
  - Occupancy statistics (occupied/available rooms)
  - Reservation and issue statistics
  - Issue breakdown by status and priority
  - Recent issues with priority indicators
  - Upcoming events
  - Recent reservations
  - Active announcements
- **User Management**:
  - Search by name, email
  - Edit user information
  - Remove residents
  - Assign residents to rooms
- **Facilities Management**:
  - **Buildings**: Full CRUD operations
  - **Rooms**: Create, edit, delete rooms with standard assignment
  - **Room Standards**: Define room standards with occupancy-based pricing
    - Create standards (name, occupancy, price)
    - Edit and delete standards
    - Assign standards to rooms
    - Cannot delete standards assigned to rooms
  - **Resources**: Manage reservable resources (laundry machines, common rooms)
    - Configure resource types (STANDARD, LAUNDRY)
    - Set active/inactive status
  - **Common Spaces**: Manage shared facilities
- **Reservations Management**:
  - View all reservations across the facility
  - Filter by status
  - Search by user or resource
  - Approve/reject pending reservations
  - Cancel reservations
- **Issues Management**:
  - View all maintenance issues
  - Filter by status, priority, building
  - Search by title
  - Update issue status
  - Change priority levels
  - Assign technicians to issues
  - Track issue resolution
- **Events Management**:
  - Create new events
  - Edit event details
  - Delete events
  - Associate events with buildings/resources
- **Announcements Management**:
  - Create announcements
  - Edit announcements
  - Delete announcements
  - Set building-specific targeting
  - Manage announcement categories
  - Control announcement visibility dates

#### 🔧 Technician
- **Technician Dashboard**: Task-focused overview
  - Statistics:
    - Active tasks count
    - Resolved tasks count
    - In-progress tasks count
    - Reported (new) tasks count
  - Quick actions:
    - View new assigned tasks
    - View tasks history
- **My Assigned Tasks**:
  - View tasks assigned by administrators
  - Filter by status (REPORTED, IN_PROGRESS, RESOLVED)
  - Update task status
  - View task details (title, description, priority, room, building)
  - Pagination and sorting
- **Tasks History**:
  - View completed tasks
  - Filter by building
  - Track resolved issues

### Core Modules

#### 🏢 Facilities Management
- **Buildings**:
  - Create, update, and delete buildings
  - Track building name and address
  - Associate rooms and resources with buildings
- **Rooms**:
  - Manage room assignments
  - Set room capacity and occupancy
  - Assign room standards for pricing
  - Track room availability
- **Room Standards**:
  - Define standards with unique codes
  - Occupancy-based pricing (different prices for different capacities)
  - Format: Standard name + occupancy (e.g., "Standard A (2 osoby)")
  - Cannot delete standards assigned to existing rooms
  - Automatic price display based on assigned standard
- **Resources**:
  - Configure reservable resources (laundry machines, common rooms, etc.)
  - Support for different resource types (STANDARD, LAUNDRY)
  - Active/inactive resource status management
  - Building association
- **Common Spaces**:
  - Define shared facility areas
  - Manage availability

#### 📅 Reservations
- Real-time availability checking
- Time slot management for different resource types
- Laundry-specific slot booking (predefined time slots)
- Standard resource booking (custom time ranges)
- Reservation status workflow (Pending → Confirmed/Cancelled)
- Conflict detection and prevention
- Admin approval workflow
- Resident self-service cancellation

#### 🔨 Issues (Maintenance)
- Issue creation with priority levels (LOW, MEDIUM, HIGH, URGENT)
- Status tracking (REPORTED, IN_PROGRESS, RESOLVED, CANCELLED)
- Room and building association
- Issue description and details
- Admin dashboard with issue statistics
- **Technician assignment**: Admins can assign specific technicians to issues
- **Technician task management**: Technicians can view and update their assigned tasks
- Filtering and pagination
- Status update workflow

#### 📢 Events
- Calendar-based event management
- Building and resource association
- Date range filtering
- Event creation, update, and deletion
- Event details (title, description, start/end time, location)
- Display for residents and admins
- Upcoming events on dashboards

#### 📣 Announcements
- Category-based announcements
- Building-specific targeting
- Date range for active announcements
- Full CRUD operations (Admin only)
- Display on resident and admin dashboards
- Support for important/priority announcements

#### 🛒 Marketplace
- Listing creation with image uploads (stored in Docker volumes)
- Category classification
- Listing types (BUY, SELL)
- Price display
- Contact information sharing
- User's own listings management
- Image support with file upload
- Listing details and descriptions

## 🛠️ Technology Stack

### Backend
- **Java 25**
- **Spring Boot 3.5.6**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with PostgreSQL
- **GraphQL** (Spring for GraphQL)

### Frontend
- **Angular 19**
- **TypeScript**
- **Tailwind CSS** for styling
- **Apollo Client** for GraphQL
- **RxJS** for reactive programming
- **Angular Router** for navigation
- **i18n** (ngx-translate) for internationalization

### Database
- **PostgreSQL 16**

### DevOps
- **Docker** & **Docker Compose**
- **Nginx** for frontend serving
- **Volume management** for uploaded files

## 📁 Project Structure

```
mydorm/
├── backend/
│   ├── src/main/java/com/montelzek/mydorm/
│   │   ├── config/              # Security, GraphQL configuration
│   │   ├── security/            # JWT, UserDetails implementation
│   │   ├── user/                # User entity, repository, service
│   │   ├── building/            # Building management
│   │   ├── room/                # Room management
│   │   ├── roomstandard/        # Room standards with pricing
│   │   ├── reservation/         # Reservation system
│   │   ├── issue/               # Maintenance issues
│   │   ├── event/               # Event management
│   │   ├── announcement/        # Announcements
│   │   ├── marketplace/         # Marketplace listings
│   │   └── dashboard/           # Dashboard statistics
│   ├── src/main/resources/
│   │   ├── graphql/             # GraphQL schemas
│   │   ├── db/migration/        # Flyway migration scripts
│   │   ├── messages*.properties # i18n resources
│   │   └── application.properties
│   └── uploads/                 # Uploaded files (Docker volume)
└── frontend/
    └── src/app/
        ├── core/
        │   ├── guards/          # Auth guards
        │   ├── interceptors/    # HTTP interceptors
        │   └── services/        # Core services (auth, GraphQL)
        ├── shared/
        │   └── components/      # Reusable components
        └── features/
            ├── auth/            # Login, register
            ├── admin/           # Admin panel
            │   ├── dashboard/
            │   ├── users-management/
            │   ├── facilities-management/
            │   ├── reservations-management/
            │   ├── issues-management/
            │   ├── events-management/
            │   └── announcements-management/
            ├── resident/        # Resident panel
            │   ├── dashboard/
            │   ├── reservations/
            │   ├── issues/
            │   ├── events/
            │   ├── announcements/
            │   └── marketplace/
            └── technician/      # Technician panel
                ├── dashboard/
                ├── new-tasks/
                └── tasks-history/
```

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Java 21 (for local development)
- Node.js 18+ (for local development)
- Maven (for local development)

### Running with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd mydorm
```

2. Start the application:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080
- GraphQL Playground: http://localhost:8080/graphiql

### Local Development

#### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 🔐 Authentication & Authorization

### JWT Authentication
- Stateless authentication using JWT tokens
- Token generated on login and included in subsequent requests
- Token validation via `JwtAuthenticationFilter`

### User Roles
- **ROLE_ADMIN**: Full system access
- **ROLE_RESIDENT**: Resident features
- **ROLE_TECHNICIAN**: Maintenance task management

### Password Security
- BCrypt hashing for password storage
- Minimum password requirements enforced

## 🗄️ Database Schema

Key entities:
- **users**: User accounts with roles
- **buildings**: Dormitory buildings
- **rooms**: Individual rooms with standard assignment
- **room_standards**: Room pricing standards with occupancy
- **reservations**: Facility reservations
- **issues**: Maintenance requests
- **events**: Dormitory events
- **announcements**: System announcements
- **marketplace_listings**: Student marketplace

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
