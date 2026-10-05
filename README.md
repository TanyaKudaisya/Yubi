# Yubi

Yubi is a campus-focused real-time chat application built for secure peer-to-peer communication. The application supports campus-restricted authentication, real-time messaging, online presence, image sharing, unread message tracking, and read receipts.

The backend was migrated from the original MERN implementation to **Java Spring Boot**, with **PostgreSQL** as the relational database and **STOMP over WebSockets** for real-time communication.

---

## Features

- Campus-restricted user authentication
- JWT-based authentication and authorization
- BCrypt password hashing
- Real-time one-to-one messaging
- Real-time online/offline presence
- Image sharing through Cloudinary
- Unread message counts
- Message read receipts
- Profile management
- Profile picture uploads
- Input validation
- Centralized exception handling
- Persistent chat history using PostgreSQL
- JWT authentication for WebSocket connections

---

## Tech Stack

### Frontend

- React.js
- Vite
- Zustand
- Axios
- Tailwind CSS
- STOMP.js

### Backend

- Java
- Spring Boot
- Spring MVC
- Spring Security
- Spring Data JPA
- Hibernate
- WebSocket / STOMP
- Maven
- Bean Validation

### Database & Services

- PostgreSQL
- Cloudinary

---

## Architecture

```text
                         ┌─────────────────────┐
                         │      React.js       │
                         │       Frontend      │
                         └──────────┬──────────┘
                                    │
                         REST APIs  │  WebSocket/STOMP
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Spring Boot      │
                         │       Backend       │
                         ├─────────────────────┤
                         │ Spring Security     │
                         │ JWT Authentication  │
                         │ REST Controllers    │
                         │ WebSocket/STOMP     │
                         │ Service Layer       │
                         │ JPA / Hibernate     │
                         └───────┬───────┬─────┘
                                 │       │
                         ┌───────▼───┐   │
                         │ PostgreSQL │   │
                         └───────────┘   │
                                         ▼
                                  ┌────────────┐
                                  │ Cloudinary │
                                  └────────────┘
```

---

## Project Structure

```text
Yubi/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/tanya/yubi_backend/
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── exception/
│   │   │   │       ├── model/
│   │   │   │       ├── repository/
│   │   │   │       ├── security/
│   │   │   │       └── service/
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── store/
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## Backend Architecture

The backend follows a layered Spring Boot architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```

### Controllers

Handle HTTP requests and expose REST APIs for authentication, users, profiles, and messaging.

### Services

Contain the application's business logic, including authentication, user management, messaging, presence tracking, and Cloudinary integration.

### Repositories

Use Spring Data JPA to interact with PostgreSQL.

### Entities

JPA entities represent persistent data such as users and messages.

---

## Authentication

Yubi uses **JWT-based authentication with Spring Security**.

The authentication flow is:

```text
User Login
    ↓
Credential Validation
    ↓
Password Verification
    ↓
JWT Generation
    ↓
JWT sent to Frontend
    ↓
Authorization: Bearer <token>
    ↓
JWT Authentication Filter
    ↓
Authenticated Request
```

Passwords are securely hashed using BCrypt.

User registration is restricted to institutional `@glbitm.ac.in` email addresses.

---

## Real-Time Messaging

Yubi uses **STOMP over WebSockets** for real-time communication.

Each authenticated user subscribes to a user-specific messaging destination:

```text
/topic/messages/{userId}
```

This allows messages to be delivered instantly without requiring page refreshes.

WebSockets are also used for:

- Online/offline presence
- Message read receipts

### Message Flow

```text
Sender
   ↓
REST API
   ↓
Spring Boot
   ↓
PostgreSQL
   ↓
STOMP WebSocket
   ↓
Receiver
```

---

## Read Receipts

Messages maintain a read state in PostgreSQL.

```text
✓   Message sent and not yet read
✓✓  Message has been read
```

When a receiver opens a conversation, the backend updates the corresponding messages and broadcasts a read receipt through WebSocket.

---

## Online Presence

Yubi tracks active WebSocket connections to determine whether users are online.

Presence updates are broadcast through:

```text
/topic/presence
```

The frontend updates the sidebar in real time when users connect or disconnect.

---

## Image Sharing

Users can send image messages through the application.

Images are uploaded to **Cloudinary**, while the resulting image URL is stored with the message in PostgreSQL.

```text
Frontend
    ↓
Image Upload
    ↓
Spring Boot
    ↓
Cloudinary
    ↓
Image URL
    ↓
PostgreSQL
```

---

## Database

Yubi uses **PostgreSQL** for persistent storage.

### User

Stores:

- User ID
- Name
- Institutional email
- Password hash
- Profile picture
- Account creation timestamp

### Message

Stores:

- Message ID
- Sender
- Receiver
- Text
- Image URL
- Read status
- Creation timestamp

JPA/Hibernate handles the mapping between Java entities and PostgreSQL tables.

---

## API Overview

### Authentication

```text
POST /api/users
POST /api/users/login
GET  /api/users/me
```

### Users

```text
GET  /api/users
GET  /api/users/online
PUT  /api/users/profile
POST /api/users/profile-picture
```

### Messages

```text
GET  /api/messages/{userId}
POST /api/messages
POST /api/messages/image
GET  /api/messages/unread
PUT  /api/messages/{userId}/read
```

---

## Environment Variables

Sensitive credentials are stored using environment variables and are not committed to the repository.

The backend requires:

```text
DB_USERNAME
DB_PASSWORD
JWT_SECRET

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Never commit actual credentials, API keys, database passwords, or JWT secrets to the repository.

---

## Running Locally

### Prerequisites

Make sure the following are installed:

- Java 21
- PostgreSQL
- Node.js
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/TanyaKudaisya/Yubi.git
cd Yubi
```

### 2. Configure PostgreSQL

Create a PostgreSQL database named:

```text
yubi
```

Configure the following environment variables:

```text
DB_USERNAME
DB_PASSWORD
```

### 3. Configure Cloudinary

Set:

```text
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

### 4. Configure JWT

Set:

```text
JWT_SECRET
```

The secret should be sufficiently long and securely stored.

### 5. Run the Spring Boot Backend

From the project root:

```bash
cd backend
```

On Windows:

```bash
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### 6. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## Security

The application implements:

- JWT authentication
- Stateless Spring Security sessions
- BCrypt password hashing
- Campus email restriction
- Authenticated REST endpoints
- JWT authentication for WebSocket connections
- CORS configuration
- Request validation
- Centralized exception handling
- Environment-based secret management

---

## Testing

The application was tested locally across the following flows:

- User signup
- User login
- JWT authentication
- Profile management
- Profile picture upload
- One-to-one messaging
- Image messaging
- Online/offline presence
- Unread message tracking
- Message read receipts
- WebSocket communication

---

## Future Improvements

- Group conversations
- Message editing and deletion
- Typing indicators
- Message search
- Push notifications
- Message reactions
- Production monitoring
- Rate limiting
- Improved notification system

---

## Author

**Tanya Kudaisya**

Computer Science & Engineering

GitHub: https://github.com/TanyaKudaisya
