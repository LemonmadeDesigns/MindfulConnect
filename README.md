# MindfulConnect

MindfulConnect is a comprehensive mental health monitoring application designed to help users track their emotional well-being, connect with support groups, and maintain a healthy mental state. This full-stack application provides a secure, user-friendly platform for tracking moods, activities, and emotional patterns over time.

## Features

Our application offers several key features to support mental health monitoring and improvement:

- **Mood Tracking**: Users can log their daily moods, emotions, and associated activities.
- **Activity Impact Analysis**: Understanding how different activities affect emotional well-being.
- **Support Group Integration**: Connection with supportive communities sharing similar experiences.
- **Visual Analytics**: Comprehensive charts and graphs showing mood patterns and trends.
- **Personalized Insights**: Data-driven suggestions for maintaining emotional well-being.

## Technology Stack

### Frontend

- React 18.x
- Vite
- TailwindCSS for styling
- Recharts for data visualization
- Axios for API communication

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Getting Started

### Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/mindfulconnect.git
   cd mindfulconnect
   ```

2. Set up the backend:

   ```bash
   cd backend
   npm install
   ```

   Create a .env file in the backend directory:

   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/mindfulconnect
   JWT_SECRET=your_jwt_secret_here
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. Set up the frontend:

   ```bash
   cd ../frontend
   npm install
   ```

   Create a .env file in the frontend directory:

   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

### Running the Application

1. Start MongoDB with a local data directory:

   ```bash
   # Create a data directory if it doesn't exist
   mkdir -p data/db

   # Start MongoDB using the project's data directory
   mongod --dbpath data/db
   ```

   Note: Keep this terminal window running. Open a new terminal for the next steps.

   If you encounter any permission issues with the data directory, run:

   ```bash
   sudo chown -R `id -un` data/db
   ```

2. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

3. In a new terminal, start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:5001>

## Project Structure

```text
mindfulconnect/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── services/
│   │   └── main.jsx
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── config/
    │   ├── models/
    │   ├── routes/
    │   └── server.js
    └── package.json
```

## Development Guidelines

### Code Style

- Use ESLint and Prettier for consistent code formatting
- Follow React best practices and hooks guidelines
- Write meaningful commit messages following conventional commits

### Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are:

- Generated upon successful login/registration
- Stored in localStorage
- Included in API requests via Authorization header
- Verified on the backend for protected routes

### Environment Variables

Remember to never commit .env files. Use .env.example files to document required environment variables.

## API Documentation

### Auth Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Authenticate user
- GET /api/auth/verify - Verify JWT token

### Mood Endpoints

- POST /api/mood - Create mood entry
- GET /api/mood/stats - Get mood statistics
- GET /api/mood/list - Get mood history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments

Special thanks to:

- The React team for their excellent documentation
- MongoDB for their robust database solution
- The open-source community for various tools and libraries used in this project

## Contributors

- **[Terrell D Lemons](LemonsTerrell@csu.fullerton.edu)** (CWID: 886659440)
- **[Kyle Williams](Kyle.williams953@csu.fullerton.edu)** (CWID: 886805050)
- **Luis Valle-Arellanes** (CWID: 889900429)

---

Project Link: [https://github.com/LemonmadeDesigns/MindfulConnect](https://github.com/LemonmadeDesigns/MindfulConnect)
