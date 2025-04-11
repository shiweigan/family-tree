# Family Tree Project

## Overview
The Family Tree project is a mobile web application designed for managing family trees. It includes features for user authentication, role-based access control, and a visual representation of family relationships.

## Features
- **User Authentication**: Users can register and log in to access the application.
- **Role Management**: The application supports both admin and regular user roles, allowing for different levels of access and functionality.
- **Family Tree Visualization**: Users can view a graphical representation of their family tree, with the ability to click on nodes for more information.
- **Admin Dashboard**: Admins have access to a dashboard for managing family tree data and user accounts.
- **Bottom Navigation Bar**: A tabbed navigation interface for easy access to different sections of the app.

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
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd familyTree
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage
To start the development server, run:
```
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the ISC License.