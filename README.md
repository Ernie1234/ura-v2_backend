# URA Backend

A robust MERN stack backend built with TypeScript, Express.js, and MongoDB, featuring enterprise-level architecture and best practices.

## 🚀 Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Express.js**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **Authentication**: JWT-based auth with social login (Google, Apple)
- **File Uploads**: Multer + AWS S3 integration
- **Security**: Helmet, CORS, rate limiting
- **Error Handling**: Comprehensive error management
- **Logging**: Winston with rotating log files
- **Validation**: Joi schema validation
- **Testing**: Jest + Supertest setup
- **Docker**: Containerized development and production
- **Code Quality**: ESLint + Prettier configuration

## 📋 Prerequisites

- Node.js 18+
- Bun (recommended) or npm/yarn
- MongoDB 5.0+
- Docker (optional)

## 🛠️ Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ura-backend
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables in `.env`

4. **Create required directories**
   ```bash
   mkdir -p logs uploads/profiles uploads/documents uploads/temp
   ```

5. **Start development server**
   ```bash
   bun run dev
   # or npm run dev
   ```

### Docker Development

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f backend
   ```

## 📁 Project Structure

```
src/
├── config/          # Configuration files
│   ├── env.config.ts
│   ├── database.config.ts
│   └── constants.ts
├── controllers/     # Route handlers
├── middleware/      # Express middleware
│   ├── auth.ts
│   ├── errorHandler.ts
│   ├── upload.ts
│   └── validation.ts
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
│   └── aws.service.ts
├── types/           # TypeScript types
├── utils/           # Utility functions
│   ├── errors.ts
│   └── logger.ts
├── validators/      # Joi validation schemas
└── app.ts          # Express app setup

tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── setup.ts        # Test configuration
```

## 🔧 Available Scripts

```bash
# Development
bun run dev          # Start development server with hot reload
bun run build        # Build for production
bun run start        # Start production server
bun run start:prod   # Start production server with NODE_ENV=production

# Code Quality
bun run lint         # Run ESLint
bun run lint:fix     # Fix ESLint issues
bun run format       # Format code with Prettier
bun run format:check # Check code formatting

# Testing
bun run test         # Run tests
bun run test:watch   # Run tests in watch mode
bun run test:coverage # Run tests with coverage

# Docker
bun run docker:build # Build Docker image
bun run docker:dev   # Start development with Docker
bun run docker:down  # Stop Docker containers
```

## 🔒 Environment Variables

Key environment variables you need to set:

```env
# Database
MONGODB_URI=mongodb://localhost:27017
DB_NAME=ura_development

# JWT Secrets (use strong, random strings)
JWT_SECRET=your_secure_jwt_secret_minimum_32_characters
JWT_REFRESH_SECRET=your_secure_refresh_secret_minimum_32_characters

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_s3_bucket_name
```

## 📚 API Documentation

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/google` - Google OAuth
- `GET /api/v1/auth/apple` - Apple OAuth

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `POST /api/v1/users/avatar` - Upload avatar

## 🧪 Testing

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage

# Run specific test file
bun run test auth.test.ts
```

## 🐳 Docker Support

The project includes multi-stage Docker support:

- **Development**: Hot reload with volume mounting
- **Production**: Optimized image with non-root user
- **Services**: MongoDB, Redis with GUI tools

## 🔍 Monitoring

- **Health Check**: `/health` endpoint
- **Logs**: Winston with daily rotation
- **Error Tracking**: Structured error logging
- **Database**: Connection monitoring

## 📈 Production Deployment

1. **Build the application**
   ```bash
   bun run build
   ```

2. **Set production environment**
   ```bash
   export NODE_ENV=production
   ```

3. **Start the server**
   ```bash
   bun run start:prod
   ```

Or use Docker:
```bash
docker build --target production -t ura-backend .
docker run -p 5000:5000 ura-backend
```

## 🤝 Contributing

1. Follow the existing code style (ESLint + Prettier)
2. Write tests for new features
3. Update documentation as needed
4. Follow conventional commit messages

## 📄 License

This project is licensed under the MIT License.