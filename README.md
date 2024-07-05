# HamRadioLog

---

### Description

HamRadioLog Frontend is the user interface for the HamRadioLog web application, designed for amateur radio (ham radio) operators to manage and track their communications. This frontend interacts with the backend server to provide a seamless experience for logging QSOs (contacts) and managing user accounts.

---

### Features

- `QSO Management`: View, create, update, and delete QSOs with other operators.
User Authentication: Register new users, login with existing credentials, and manage user accounts.

- `Protected Routes`: Certain functionalities require authentication via JSON Web Tokens (JWT) for access.
  
- `Responsive Design`: Ensures compatibility and usability across various devices and screen sizes.

---

### Dependencies and Technologies Used

- **react**: A JavaScript runtime environment that allows server-side execution of JavaScript code.
- **react-router**: Provides routing capabilities for navigating between views.
- **redux**: A predictable state container for managing application state.
- **axios**: A promise-based HTTP client for making requests to the backend server.
- **JWT Decode**: Utility library to decode JWTs on the client-side for handling authentication.
- **semantic UI React**: A UI framework that provides pre-designed components for a consistent look and feel.

---

### Installation Instructions

1. Clone the repository to your local machine.
2. Install dependencies using `npm install`.
3. Create a `.env` file and add necessary environment variables if required (e.g., backend API URL).
4. Start the development server with `npm start`.

---

### How to Use

After starting the development server, open your web browser and navigate to `http://localhost:3000` (or another specified port) to access the application.

---

### Key Components

- `QSO Management`: Navigate to view, add, edit, or delete QSOs.
- `User Authentication`: Register new users or login with existing credentials.
- `Protected Routes`: Certain pages and actions require authentication. Unauthorized access will redirect users to the login page.

---

### Example Screenshots

Login Page - (will be added)
Dashboard - (will be added)

---

### Notes

- Ensure the backend server (HamRadioLog Backend) is running and accessible to enable full functionality of the frontend application.
  
- For security reasons, handle JWTs securely and consider token expiration policies.
  
- The frontend application communicates with the backend server via RESTful API endpoints documented in the backend README file.
