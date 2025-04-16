# SIGMA Project Documentation / SIGMA प्रोजेक्ट डॉक्यूमेंटेशन

## Table of Contents / विषय सूची
1. [Project Overview / प्रोजेक्ट अवलोकन](#project-overview)
2. [Technical Stack / तकनीकी स्टैक](#technical-stack)
3. [Project Structure / प्रोजेक्ट संरचना](#project-structure)
4. [Frontend Components / फ्रंटएंड कंपोनेंट्स](#frontend-components)
5. [Backend Architecture / बैकएंड आर्किटेक्चर](#backend-architecture)
6. [API Routes / API रूट्स](#api-routes)
7. [Database Models / डेटाबेस मॉडल्स](#database-models)
8. [Security Features / सुरक्षा विशेषताएं](#security-features)
9. [Real-time Features / रीयल-टाइम विशेषताएं](#real-time-features)

## Project Overview

### English
SIGMA is a comprehensive full-stack application that provides a robust platform for course management, user authentication, payment processing, and real-time updates. The application is built using modern web technologies and follows best practices for security and scalability.

### Hindi
SIGMA एक व्यापक फुल-स्टैक एप्लिकेशन है जो कोर्स मैनेजमेंट, यूजर ऑथेंटिकेशन, पेमेंट प्रोसेसिंग और रीयल-टाइम अपडेट्स के लिए एक मजबूत प्लेटफॉर्म प्रदान करता है। एप्लिकेशन आधुनिक वेब टेक्नॉलॉजीज का उपयोग करके बनाया गया है और सुरक्षा और स्केलेबिलिटी के लिए बेस्ट प्रैक्टिस का पालन करता है।

## Technical Stack

### Frontend Technologies
- **React**: UI library for building user interfaces
- **Vite**: Build tool and development server
- **Socket.io-client**: Real-time client communication
- **CSS**: Styling and animations

### Backend Technologies
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: Database
- **Mongoose**: MongoDB object modeling
- **Socket.io**: Real-time server communication
- **JWT**: Authentication
- **Multer**: File upload handling
- **Stripe**: Payment processing

## Project Structure

### Frontend Structure
```
Frontend/
├── src/
│   ├── components/
│   ├── assets/
│   ├── AdminDashboard.jsx
│   ├── ProtectedRoute.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js
```

### Backend Structure
```
Backend/
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── paymentRoutes.js
│   └── transactionRoutes.js
├── models/
├── middleware/
├── uploads/
├── server.js
└── .env
```

## Frontend Components

### Main Components
1. **AdminDashboard.jsx**
   - Admin control panel
   - User management interface
   - Course management
   - Transaction monitoring

2. **ProtectedRoute.jsx**
   - Route protection component
   - Authentication verification
   - Role-based access control

3. **App.jsx**
   - Main application component
   - Routing configuration
   - Global state management

## Backend Architecture

### Core Components

1. **Server Configuration**
```javascript
- Express application setup
- CORS configuration
- MongoDB connection
- Socket.io integration
- Middleware setup
```

2. **Authentication System**
- JWT-based authentication
- Role-based authorization
- Secure password hashing
- Session management

3. **File Upload System**
- Multer configuration
- File type validation
- Size restrictions
- Secure file storage

## API Routes

### Authentication Routes (authRoutes.js)
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/verify-admin

### User Routes (userRoutes.js)
- GET /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

### Payment Routes (paymentRoutes.js)
- POST /api/payment/create-session
- POST /api/payment/webhook
- GET /api/payment/history

### Transaction Routes (transactionRoutes.js)
- GET /api/transactions
- POST /api/transactions
- GET /api/transactions/:id

## Security Features

1. **Authentication & Authorization**
   - JWT token validation
   - Role-based access control
   - Secure password handling

2. **Data Security**
   - Input validation
   - XSS protection
   - CSRF protection
   - Secure file uploads

3. **API Security**
   - Rate limiting
   - CORS configuration
   - Request validation

## Real-time Features

### Socket.io Implementation
```javascript
io.on("connection", (socket) => {
  // Real-time updates for:
  // - User status
  // - Course updates
  // - Payment notifications
  // - Admin dashboard stats
});
```

## Database Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String,
  role: String,
  courses: [CourseSchema]
}
```

### Course Model
```javascript
{
  title: String,
  description: String,
  price: Number,
  instructor: UserSchema,
  students: [UserSchema]
}
```

## Development Guidelines / विकास दिशानिर्देश

### English
1. Follow the established coding standards
2. Write comprehensive documentation
3. Implement proper error handling
4. Maintain test coverage
5. Use meaningful commit messages

### Hindi
1. स्थापित कोडिंग मानकों का पालन करें
2. व्यापक दस्तावेजीकरण लिखें
3. उचित त्रुटि प्रबंधन लागू करें
4. टेस्ट कवरेज बनाए रखें
5. सार्थक कमिट संदेश का उपयोग करें

## Deployment / डिप्लॉयमेंट

### Production Setup
1. Environment configuration
2. Database setup
3. SSL/TLS configuration
4. Server deployment
5. Monitoring setup

### Maintenance
1. Regular backups
2. Security updates
3. Performance monitoring
4. Error logging
5. User feedback handling 