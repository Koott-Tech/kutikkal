# Psychologist Dashboard

A comprehensive dashboard for psychologists to manage therapy sessions, availability, and packages.

## Features

### Side Menu Navigation
- **Sessions**: View and manage upcoming and completed therapy sessions
- **Availability**: Manage weekly schedule and time slots
- **Packages**: Create and manage therapy packages and pricing
- **Profile**: Update personal and professional information

### Sessions Tab
- View all scheduled sessions with patient details
- Session information includes:
  - Patient name and child details
  - Session type and package
  - Date, time, and price
  - Current status
- Actions available:
  - Mark sessions as completed
  - View session details
  - Update session notes and summary

### Availability Tab
- Weekly schedule management
- View available time slots for each day
- Quick actions:
  - Add new availability
  - Edit existing time slots
  - Remove unavailable times

### Packages Tab
- Manage therapy packages and pricing
- Package types: Individual, Package of 2, Package of 4
- Actions available:
  - Create new packages
  - Edit existing packages
  - Delete packages (if not in use)

### Profile Tab
- Update personal information
- Manage education credentials
- Set areas of expertise
- Update professional description
- Change designation (full-time/part-time)

## Backend Integration

The psychologist dashboard integrates with the Express.js backend API endpoints:

- `GET /api/psychologists/profile` - Get psychologist profile
- `PUT /api/psychologists/profile` - Update profile information
- `GET /api/psychologists/sessions` - Get all sessions
- `PUT /api/psychologists/sessions/:sessionId` - Update session details
- `GET /api/psychologists/availability` - Get availability schedule
- `PUT /api/psychologists/availability` - Update availability
- `GET /api/psychologists/packages` - Get therapy packages
- `POST /api/psychologists/packages` - Create new package
- `PUT /api/psychologists/packages/:packageId` - Update package
- `DELETE /api/psychologists/packages/:packageId` - Delete package

## Usage

1. Navigate to `/psychologist` in your application
2. Ensure you're logged in as a psychologist
3. Use the side menu to switch between different views
4. Manage upcoming sessions by marking them complete
5. Update your weekly availability schedule
6. Create and manage therapy packages
7. Keep your profile information current

## Technical Details

- Built with Next.js 15 and React 19
- Uses Tailwind CSS for styling
- Lucide React icons for UI elements
- Responsive design for mobile and desktop
- Real-time data from backend API
- Role-based access control
- JWT authentication integration

## Authentication

- Requires valid JWT token
- User must have 'psychologist' role
- Automatic redirect for unauthorized users
- Secure API communication with backend

## Future Enhancements

- Calendar view for better session visualization
- Patient search and filtering
- Session notes rich text editor
- Availability conflict detection
- Integration with calendar applications
- Mobile app support
- Real-time notifications for new bookings
- Session analytics and reporting


