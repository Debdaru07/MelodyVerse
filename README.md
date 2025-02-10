# Project Setup Guide

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm installed (for local development)

## Setup Instructions

### Step 1: Configure Environment Variables
Copy the `.env.example` file to `.env`:
```sh
cp .env.example .env
```

Update the .env file with your configuration details.

### Step 2: Email Verification Setup (Optional)
To enable email verification, enter your user email and app password from the Google Dashboard in the .env file.

If you do not configure this, the application will work without email verification.

### Step 3: Start the Application
Navigate to the project root and run:

```sh
docker-compose up --build
```

This will build and start all the required containers.

Troubleshooting
If the backend cannot connect to the database, ensure that the database container is running properly.
If you encounter uuid_generate_v4() does not exist, run the following inside the database container:

```sh
docker exec -it melodb psql -U postgres -d postgres -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
```

Additional Commands
To stop the containers:

```sh
docker-compose down
```

To restart the containers without rebuilding:
```sh
docker-compose up -d
```

To view logs:
```sh
docker-compose logs -f
```

Happy coding! 🚀
