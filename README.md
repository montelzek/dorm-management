# MyDorm 🏠

> A comprehensive full-stack web application for managing student dormitories. Built with modern technologies to streamline dormitory operations, resident management, facilities reservations, maintenance requests, events, announcements, and marketplace functionality.

## Project Status

** Work in Progress**
### Implemented Features
- User authentication and authorization (JWT)
- Resident dashboard and user management
- Facility reservations (buildings, rooms, resources)
- Issue reporting and tracking
- Event management
- Announcements system
- Marketplace listings
- Admin dashboard with statistics

### In Progress / Planned Features
- Email notifications
- Package management system
- Visitor management
- **Complete Technician role implementation** (dedicated issue management interface, status updates)

## Overview

MyDorm is a dormitory management system designed to automate and simplify the operations of student housing facilities. The application provides role-based access control with dedicated interfaces for residents, administrators, technicians, and receptionists. It handles everything from room assignments and facility reservations to maintenance tracking, event management, and a built-in marketplace for students.

### Key Capabilities

- **User Management**: Complete resident lifecycle management with role-based access
- **Facility Reservations**: Book rooms and resources (laundry, common spaces) with availability checking
- **Maintenance Tracking**: Issue reporting and resolution workflow for technical problems
- **Event Management**: Create and manage dormitory events with calendar integration
- **Announcements**: Building-specific announcements and notifications
- **Marketplace**: Buy/sell platform for residents
- **Dashboard Analytics**: Real-time statistics and insights for administrators

## ✨ Features

### User Roles

The system supports four distinct user roles, each with tailored functionality:

#### 👤 Resident
- Personal dashboard with reservations, issues, and active listings
- Create and manage facility reservations
- Report and track maintenance issues
- Browse events and announcements
- List items on marketplace (buy/sell)

#### 👨‍💼 Administrator
- Comprehensive admin dashboard with statistics
- Manage residents (assign rooms, delete accounts)
- Oversee all reservations across the facility
- Manage maintenance issues (update status, assign priority)
- Full CRUD operations for buildings, rooms, and resources
- Create and manage events
- Publish and manage announcements

#### 🔧 Technician (not implemented yet)
- Access to maintenance issues
- Update issue status and priority
- Track resolution progress

#### 🏢 Receptionist (not implemented yet)
- Manage reservations
- Handle facility bookings
- Process check-ins/check-outs

### Core Modules

#### 🏢 Facilities Management
- **Buildings**: Create, update, and delete buildings
- **Rooms**: Manage room assignments, capacity, and occupancy
- **Resources**: Configure reservable resources (laundry machines, common rooms, etc.)
- Support for different resource types (STANDARD, LAUNDRY)
- Active/inactive resource status management

#### 📅 Reservations
- Real-time availability checking
- Time slot management for different resource types
- Laundry-specific slot booking (predefined time slots)
- Standard resource booking (custom time ranges)
- Reservation cancellation (by user and admin)
- Conflict detection and prevention

#### 🔨 Issues (Maintenance)
- Issue creation with priority levels (LOW, MEDIUM, HIGH)
- Status tracking (REPORTED, IN_PROGRESS, RESOLVED, CANCELLED)
- Room and building association
- Admin dashboard with issue statistics
- Filtering and pagination

#### 📢 Events
- Calendar-based event management
- Building and resource association
- Date range filtering
- Event creation, update, and deletion
- Display for residents and admins

#### 📣 Announcements
- Category-based announcements
- Building-specific targeting
- Date range for active announcements
- Full CRUD operations

#### 🛒 Marketplace
- Listing creation with images
- Category classification
- Listing types (BUY, SELL)
- Contact information sharing
- User's own listings management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
