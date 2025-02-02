
# Event Management Platform

## Overview
The Event Management Platform (EventHub) is a full-stack application designed to help users seamlessly create, manage, and attend events. This platform provides a user-friendly interface for event creation, event filtering, and real-time updates for attendees. The system incorporates secure user authentication, event management capabilities, and an intuitive dashboard for users. The platform is deployed using free-tier services to ensure accessibility and scalability.


## Key Features
### Frontend Features:
#### User Authentication:
- Users can register, log in, and access their personalized event dashboards.
- Includes an option for "Guest Login" to allow limited access without the need for full registration.
#### Event Dashboard:
- A comprehensive display of all upcoming and past events.
- Filters available for categories and dates to enhance the user experience and ease of navigation.
#### Event Creation:
- A simple form for creating events, capturing details such as event name, description, date/time, location, and other essential information.
#### Real-Time Attendee Count:
- Live updates on the number of attendees for each event.
#### Responsive Design:
- Fully responsive design to ensure optimal functionality across all devices, including desktop, tablet, and mobile.

### Backend Features:
#### Authentication API:
- Secure user authentication utilizing JWT (JSON Web Token) to protect user sessions.
#### Event Management API:
- Provides CRUD operations for event management, allowing users to create, read, update, and delete events. Ownership restrictions ensure only event creators can modify their events.
#### Real-Time Updates:
- Socket.IO is employed to provide real-time updates to users, including changes to events or attendee counts.
#### Database:
- MongoDB is utilized to store event and user data efficiently, with data being secured and organized for optimal performance.

## Deployment
#### Frontend Hosting:
- Hosted on Netlify.
#### Backend Hosting:
- Hosted on Render.
#### Database:
- MongoDB Atlas (Free tier).
#### Image Hosting:
- Image uploads handled via Cloudinary (Free tier).


## Installation Instructions
#### Backend Setup:
- Clone the repository: git clone <repo_url>
- cd Server-Side
- Install dependencies: npm install
- Start the backend server: npm start

#### Set up environment variables in a .env file:
- PORT=<your_port>
- DATABASE=<your_mongodb_connection_string>
- DATABASE_PASSWORD=<your_database_password>
- NODE_ENV=<production_or_development>
- CLOUD_NAME=<your_cloudinary_cloud_name>
- CLOUD_API_KEY=<your_cloudinary_api_key>
- CLOUD_API_SECRET=<your_cloudinary_api_secret>
- JWT_SECRET=<your_jwt_secret>
- JWT_EXPIRES_IN=<jwt_expiry_duration>
- JWT_COOKIE_EXPIRES_IN=<cookie_expiry_duration>


### Frontend Setup:
- Navigate to the Client-Side folder: cd Client-Side
- Install dependencies: npm install
- Start the frontend server: npm run dev

## API Endpoints
### Authentication:
- Signup: POST /api/v1/users/signup
- Login: POST /api/v1/users/login
### Event Management:
- Get All Events: GET /api/v1/events?eventCategory=Technology&date[gte]=2024-06-21&date[lte]=2024-06-21
- Get Event by ID: GET /api/v1/events/:id
- Get User's Events: GET /api/v1/events/userEvents
- Create Event: POST /api/v1/events/
- Update Event: PATCH /api/v1/events/:id
- Delete Event: DELETE /api/v1/events/:id
## Technologies Used
- Frontend: React.js, Tailwind CSS, React Router, SweetAlert2, Socket.IO
- Backend: Node.js, Express.js, MongoDB, Mongoose, Socket.IO
- Authentication: JWT, bcrypt
- File Upload: Cloudinary, Multer
- Real-Time Communication: Socket.IO
- Deployment: Netlify (Frontend), Render (Backend)

## Deployment Links:
- Frontend: Live URL - https://eventhub-abhijit.netlify.app/
- Backend: Live Base URL - https://eventhub-abhijit.onrender.com

## Test User Credentials:
### Login:
- Email: abhijeetmondal5@gmail.com
- Password: test1234
- Login: Use the credentials above to login as a User.

## Contact
For any queries or support, reach out to abhijeetmondal5@gmail.com


