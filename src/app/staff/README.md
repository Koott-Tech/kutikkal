# Staff Dashboard

A comprehensive staff role page for managing therapy sessions and availability.

## Features

### Side Menu Navigation
- **Upcoming Sessions**: View and manage scheduled therapy sessions
- **Past Sessions**: Review completed sessions and notes
- **Availability**: Manage weekly schedule and time slots

### Upcoming Sessions Tab
- View all scheduled sessions with patient details
- Session information includes:
  - Patient name
  - Session type (Individual, Couples, Family Therapy)
  - Date and time
  - Duration
  - Status
- Actions available:
  - View Details
  - Reschedule
  - Mark Complete

### Past Sessions Tab
- Review completed therapy sessions
- Access session notes and reports
- View patient progress information
- Actions available:
  - View Report
  - Edit Notes

### Availability Tab
- Weekly schedule management
- View available time slots for each day
- Quick actions:
  - Block Time (mark as unavailable)
  - Add Slots (add new available times)
  - Export Schedule (download weekly schedule)

## API Integration

The staff page integrates with the backend API endpoints:

- `GET /api/staff/dashboard/:staffId` - Get dashboard overview
- `GET /api/staff/sessions/:staffId` - Get sessions by date range
- `GET /api/staff/availability/:staffId` - Get staff availability
- `POST /api/staff/availability/:staffId` - Update availability
- `POST /api/staff/sessions/:sessionId/notes` - Add session notes
- `PATCH /api/staff/sessions/:sessionId/status` - Update session status

## Usage

1. Navigate to `/staff` in your application
2. Use the side menu to switch between different views
3. Manage upcoming sessions by marking them complete or rescheduling
4. Review past sessions and access patient notes
5. Update your weekly availability schedule

## Technical Details

- Built with Next.js 15 and React 19
- Uses Tailwind CSS for styling
- Lucide React icons for UI elements
- Responsive design for mobile and desktop
- Error handling with fallback to mock data
- Real-time session status updates

## Future Enhancements

- Calendar view for better session visualization
- Patient search and filtering
- Session notes rich text editor
- Availability conflict detection
- Integration with calendar applications
- Mobile app support

