# Family Tree Project

## Overview
The Family Tree project is a mobile web application designed for managing family trees. It includes features for user authentication, role-based access control, and a visual representation of family relationships.

## Features
- **User Authentication**: Users can register and log in to access the application.
- **Role Management**: The application supports both admin and regular user roles, allowing for different levels of access and functionality.
- **Family Tree Visualization**: Users can view a graphical representation of their family tree, with the ability to click on nodes for more information.
- **Admin Dashboard**: Admins have access to a dashboard for managing family tree data and user accounts.
- **Bottom Navigation Bar**: A tabbed navigation interface for easy access to different sections of the app.
- **Backend Service**: A Node.js-based backend service using `Express` and `better-sqlite3` for managing family tree data.

## Project Structure
```
familyTree
├── src
│   ├── components
│   │   ├── Auth
│   │   ├── Admin
│   │   ├── User
│   │   └── Navigation
│   ├── pages
│   ├── routes
│   ├── services
│   ├── styles
│   ├── utils
│   └── types
├── public
├── server
│   └── server.js
├── family.db
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd familyTree
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Backend Service Setup
1. Start the backend service:
   ```bash
   node src/server/server.js
   ```
   The backend service will start on `http://localhost:3001`.

2. Ensure the database file `family.db` is created in the root directory. If it doesn't exist, the server will initialize it with sample data.

## Usage
To start the development server, run:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to view the application.

## API Endpoints
The backend service provides the following API endpoints:
- **GET /api/members**: Fetch all family members.
- **POST /api/members**: Add a new family member.
- **PUT /api/members/:id**: Update an existing family member.
- **DELETE /api/members/:id**: Delete a family member.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the ISC License.