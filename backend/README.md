# Zip Membership Portal - Backend API

Modern Node.js Express backend with Firebase authentication for the Zip Membership Portal.

## Features

- 🔐 Firebase Authentication with JWT token verification
- 👥 User management with role-based access control
- 💳 Membership management system
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)
- ✅ Input validation with express-validator
- 📝 Comprehensive error handling
- 🚀 Production-ready setup

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase configuration in `.env`

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Start production server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify Firebase token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/role/:uid` - Set user role (admin only)
- `POST /api/auth/refresh-claims` - Refresh custom claims

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:uid` - Get user by ID
- `PUT /api/users/:uid` - Update user
- `DELETE /api/users/:uid` - Delete user (admin only)

### Membership
- `GET /api/membership/status` - Get user's membership status
- `GET /api/membership` - Get all memberships (admin only)
- `POST /api/membership` - Create/Update membership
- `PUT /api/membership/:uid/status` - Update membership status (admin only)
- `POST /api/membership/:uid/extend` - Extend membership

## Authentication Flow

1. **Frontend**: User signs in with Firebase Auth
2. **Frontend**: Gets ID token from Firebase
3. **Frontend**: Sends requests with `Authorization: Bearer <token>` header
4. **Backend**: Verifies token with Firebase Admin SDK
5. **Backend**: Extracts user info and processes request

## Project Structure

```
src/
├── config/          # Configuration files
│   └── firebase.js  # Firebase Admin setup
├── controllers/     # Route controllers
│   ├── authController.js
│   ├── userController.js
│   └── membershipController.js
├── middleware/      # Custom middleware
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
├── routes/          # API routes
│   ├── auth.js
│   ├── users.js
│   └── membership.js
├── helpers/         # Business logic helpers
│   ├── userHelpers.js
│   └── membershipHelpers.js
├── utils/           # Utility functions
│   ├── responseHelpers.js
│   └── dateHelpers.js
└── server.js        # Main server file
```

## Environment Variables

```env
PORT=5000
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Sanitize and validate inputs
- **Firebase Auth**: Secure token verification
- **Role-based Access**: Admin/user permissions

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Development

- `npm run dev` - Start with nodemon for auto-reload
- `npm test` - Run tests
- `npm start` - Production start

## Deployment

1. Set environment variables in production
2. Ensure Firebase service account is configured
3. Run `npm start`

## License

MIT