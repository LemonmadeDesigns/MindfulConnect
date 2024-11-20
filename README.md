# Mental Health Support Platform (MindfulConnect)

## Overview

MindfulConnect is a comprehensive mental health support platform that provides anonymous peer support, AI-powered mood tracking, and access to various support groups.

## Prerequisites

### Python Setup

- Python 3.11+
- pip (Python package manager)

### Database Setup

#### MongoDB

```bash
# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify MongoDB is running
mongosh

# Stop MongoDB (when needed)
brew services stop mongodb-community

# Install MongoDB (Windows)
# Download and install from: https://www.mongodb.com/try/download/community
# Start MongoDB service from Windows Services

# Install MongoDB (Linux)
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
```

#### Redis (for caching)

```bash
# Install Redis (macOS)
brew install redis

# Start Redis
brew services start redis

# Stop Redis (when needed)
brew services stop redis
```

#### MongoDB Setup (OPTIONAL)

1. First, create MongoDB data directory:

```bash
# Create data directory in home folder
mkdir -p ~/data/db
```

1. Start MongoDB with the specific data path:

```bash
# Start MongoDB daemon with the data directory
mongod --dbpath ~/data/db
```

To stop MongoDB:

```bash
# If needed, you can stop MongoDB with
pkill mongod
```

If you get "address already in use" error:

```bash
# Check for existing MongoDB processes
ps aux | grep mongod

# Kill any existing MongoDB processes
kill 
# OR
killall mongod

# Then start MongoDB again
mongod --dbpath ~/data/db
```

## Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/mindfulconnect.git
cd mindfulconnect
```

1. Create and activate virtual environment

```bash
# Create venv
python3.11 -m venv venv

# Activate venv (macOS/Linux)
source venv/bin/activate
# OR Windows
.\venv\Scripts\activate
```

1. Install dependencies

```bash
pip install -r backend/requirements.txt
```

1. Create .env file in project root

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=mindfulconnect
JWT_SECRET_KEY=your-super-secret-key-here
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your-openai-api-key
DEBUG=True
ENVIRONMENT=development
```

## Running the Application

1. Start MongoDB (in a separate terminal):

```bash
mongod --dbpath ~/data/db
```

1. Initialize the database (first time only):

```bash
python -m backend.app.db.init_db
```

1. Start the application:

```bash
# Make sure you're in your virtual environment
source venv/bin/activate

# Start the application
uvicorn backend.app.main:app --reload
```

The application will be available at:

- Main application: <http://localhost:8000>
- API documentation: <http://localhost:8000/docs>
- ReDoc documentation: <http://localhost:8000/redoc>
- OpenAPI schema: <http://localhost:8000/openapi.json>

## API Documentation

### Available Endpoints

- Authentication: `/api/v1/auth/`
  - Register: POST `/register`
  - Login: POST `/token`
- Support Groups: `/api/v1/support-groups/`
- Mood Tracking: `/api/v1/mood/`
- Chatbot: `/api/v1/chatbot/`
- Dashboard: `/api/v1/dashboard/`

### Health Check

You can verify the application is running correctly:

```bash
curl http://localhost:8000/health
```

## Features

### Core Functionalities

- 🔒 Anonymous user authentication system
- 👥 Peer support matching
- 📊 AI-powered mood tracking
- 🤖 24/7 AI chatbot support
- 📱 Daily check-in system

### Support Groups

- Criminal & Gang Anonymous (CGA)
- Alcoholics Anonymous (AA)
- Narcotics Anonymous (NA)
- Emotional Intelligence Development
- Anger Management

## Project Structure

```txt
mindfulconnect/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints/
│   │   │       ├── auth.py
│   │   │       └── support_groups.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── db/
│   │   │   └── mongodb.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   └── support_group.py
│   │   └── main.py
│   └── requirements.txt
├── .env
└── README.md
```

## Development Guidelines

- Follow PEP 8 style guide
- Write unit tests for new features
- Document API endpoints using OpenAPI specifications
- Use conventional commits

## Security

- All user data is encrypted
- Support group discussions are anonymized
- Regular security audits
- HIPAA compliance measures

## Contributors

- **[Terrell D Lemons](LemonsTerrell@csu.fullerton.edu)** (CWID: 886659440)
- **[Kyle Williams](Kyle.williams953@csu.fullerton.edu)** (CWID: 886805050)
- **Luis Valle-Arellanes** (CWID: 889900429)

## License

MIT License - see [LICENSE.md](LICENSE.md)
