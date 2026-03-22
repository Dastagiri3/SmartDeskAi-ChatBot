# SmartDesk AI

A full-stack multilingual IT Help Desk Chatbot powered by AI and cloud services. This application automates Tier-1 IT support by allowing users to submit support tickets in English or Japanese, receive AI-powered resolutions instantly, and track ticket status.

## Features

- **AI-Powered Resolution**: Get instant solutions for common IT issues powered by advanced AI
- **Multilingual Support**: Submit tickets in English or Japanese with automatic translation
- **Real-time Ticket Management**: Track ticket status from submission to resolution
- **Admin Dashboard**: Comprehensive admin panel for managing all support tickets
- **User Authentication**: Secure login and signup with role-based access control
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Enterprise-Grade UI**: Clean, professional SaaS aesthetic

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend & Database
- **Supabase** for authentication and database
- **PostgreSQL** database with Row Level Security (RLS)
- **Real-time subscriptions** for live updates

### AI & Automation (Mock Implementation)
- Mock AI resolution service simulating Amazon Bedrock
- Simulated translation service (Amazon Translate equivalent)
- Category-based intelligent responses

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── context/            # React Context providers
│   ├── AuthContext.tsx
│   └── LanguageContext.tsx
├── mock/               # Mock AI services
│   └── aiMock.ts
├── pages/              # Page components
│   ├── AdminPanel.tsx
│   ├── Dashboard.tsx
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Settings.tsx
│   ├── Signup.tsx
│   ├── SubmitTicket.tsx
│   └── TicketDetail.tsx
├── types/              # TypeScript definitions
│   └── database.ts
├── utils/              # Utility functions
│   └── translations.ts
├── lib/                # External integrations
│   └── supabase.ts
├── App.tsx            # Main app component
└── main.tsx           # App entry point
```

## Database Schema

### Tables

#### profiles
- User profile information
- Linked to Supabase Auth
- Stores role (user/admin), preferred language, notification preferences

#### tickets
- Support ticket data
- Issue descriptions and AI resolutions
- Multilingual support with translations
- Status tracking (Open, Resolved, Escalated)
- Confidence scoring (High, Medium, Low)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Usage

### User Flow

1. **Sign Up/Login**: Create an account or log in
2. **Submit Ticket**: Fill out the support ticket form with issue details
3. **AI Analysis**: Wait 3 seconds while AI analyzes the issue
4. **Review Resolution**: Review the AI-generated step-by-step solution
5. **Action**: Mark as resolved or escalate to human support
6. **Track**: View all tickets and their status in the dashboard

### Admin Flow

1. **Admin Login**: Login with admin credentials
2. **View All Tickets**: Access the admin panel to see all user tickets
3. **Filter & Export**: Filter by status, category, language, and export to CSV
4. **Monitor Escalations**: Track escalated tickets requiring human intervention

## Color Palette

- **Primary Blue**: `#1B4F9B` - Main brand color for buttons, links, active states
- **Accent Green**: `#1D9E75` - Success states, resolved tickets
- **Warning Amber**: `#EF9F27` - Medium confidence, open tickets
- **Danger Red**: `#E24B4A` - Escalated tickets, errors

## Features by Page

### Landing Page
- Hero section with call-to-action
- Feature highlights
- How it works section

### Dashboard
- Summary statistics cards
- Recent tickets table
- Quick actions

### Submit Ticket
- Multi-field form with validation
- Language selection
- AI analysis with loading animation
- Resolution display with confidence score

### Ticket Detail
- Complete ticket information
- AI resolution card
- Status timeline
- Action buttons (resolve/escalate)

### Admin Panel
- All tickets view
- Advanced filtering
- Escalated tickets alert
- CSV export functionality

### Settings
- User profile management
- Language preferences
- Notification settings

## Mock AI Implementation

The application includes a sophisticated mock AI system that simulates:

1. **Category-based responses**: Different solutions for Network, Software, Hardware, Access, and Other issues
2. **Confidence scoring**: High, Medium, or Low confidence ratings
3. **Translation simulation**: Mock translation between English and Japanese
4. **Realistic delays**: 3-second processing time to simulate real AI analysis

## Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **Role-based access control**: User and admin roles
- **Protected routes**: Client-side route protection
- **Secure authentication**: Powered by Supabase Auth

## Future Enhancements

When connecting to real AWS services:

1. Replace mock AI with Amazon Bedrock integration
2. Implement real Amazon Translate for multilingual support
3. Add Amazon SES for email notifications
4. Integrate Amazon CloudWatch for monitoring
5. Set up S3 + CloudFront for hosting
6. Configure Amazon Cognito for enhanced auth

## License

This project is for demonstration purposes.

## Support

For issues or questions, please create a support ticket through the application.
