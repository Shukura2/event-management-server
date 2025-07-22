# Agenda - Event Management Solution (Backend)

A backend solution built with Node.js to manage upcoming events and all necessary information about each event. It also allows event organizers (admins) to upload, edit and delete events, as well as manage attendee feedback.

![Agenda Application Screenshot](./public/app-shot.png)

## Features

For Attendees

- View and attend upcoming event
- Authentication (Google Sign-In)
- Submit feedback and ratings

For Admin

- Authentication (Google Sign-In)
- Create, edit and delete events
- View attendee information for specific event
- Send feedback requests to event attendees

## Getting Started

### Prerequisite

- Node.js (v18+)
- npm or yarn

### Installation

```bash
git clone https://github.com/Shukura2/event-management-server.git
cd event-management-server
npm install
npm run startdev
```

### Environment Variable

Create a `.env.local` file in the root directory and add:

```env
TEST_ENV_VARIABLE=test-variable
CONNECTION_STRING=postgresql://user:password@host:port/database
PORT=5000
SECRET_KEY=your-secret-key
SESSION_SECRET=your-session-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=http://localhost:3000
NODEMAILER_AUTH_PASS=your-passkey
```

## Usage

For Attendees

- Create an account
- Browse and select an event
- Click Attending event

For Admin

- Create an account
- Request or enable admin access
- Login

## Built with

- Node.js
- Express.js
- PostgreSQL
- Cloudinary
- Nodemailer

## Contributing

Pull requests are welcomed for major changes, please open an issue first to discuss what you would like to change.
