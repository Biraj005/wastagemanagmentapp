# Waste Management Backend

A comprehensive backend system for managing waste complaints and administrative operations across multiple districts. Built with **Spring Boot 4.0.3**, this REST API provides authentication, complaint management, and district administration features.

## 🚀 Features

### Authentication & Authorization
- **User Registration**: Sign up with email and password
- **JWT Authentication**: Secure token-based authentication
- **Password Recovery**: Forgot password functionality with OTP verification
- **Role-Based Access Control**: Support for multiple user roles (Admin, District Admin, User)

### Complaint Management
- **Create Complaints**: Users can submit waste management complaints
- **Track Complaints**: View complaint status and history
- **Status Updates**: District admins can update complaint status
- **Complaint Filtering**: Retrieve complaints by district or status
- **Image Upload**: Cloudinary integration for complaint image storage

### Admin Dashboard
- **User Management**: Create and manage district administrators
- **Statistics**: View total complaints, pending complaints, and admin count
- **Complaint Overview**: Monitor all complaints across districts
- **District Management**: Create and organize districts

### Email Notifications
- Password reset email notifications
- OTP verification emails
- Built-in email service using Gmail SMTP

## 🏗️ Tech Stack

- **Language**: Java 17
- **Framework**: Spring Boot 4.0.3
- **Database**: PostgreSQL
- **ORM**: JPA/Hibernate
- **Authentication**: JWT (JSON Web Tokens) with JJWT
- **Build Tool**: Maven
- **Cloud Storage**: Cloudinary
- **Email Service**: Gmail SMTP
- **Data Validation**: Jakarta Validation
- **Lombok**: For reducing boilerplate code

## 📋 Project Structure

```
src/main/java/com/wastemanagement/backend/
├── controllers/
│   ├── AdminController.java        # Admin operations
│   ├── AuthController.java         # Authentication endpoints
│   ├── ComplaintController.java    # Complaint management
│   └── UserController.java         # User operations
├── services/
│   ├── AdminService.java
│   ├── AuthService.java
│   ├── ComplaintService.java
│   └── UserService.java
├── entities/
│   ├── User.java
│   ├── Complaint.java
│   ├── District.java
│   ├── Role.java                   # Role enumeration (Admin, District Admin, User)
│   └── Status.java                 # Status enumeration (Pending, Resolved, etc.)
├── dto/                            # Data Transfer Objects
│   ├── SignupRequestDto.java
│   ├── LoginRequestDto.java
│   ├── ComplaintRequestDto.java
│   ├── ComplaintResponseDto.java
│   └── ApiResponse.java            # Standard API response wrapper
├── repositories/                   # JPA repositories
│   ├── UserRepository.java
│   ├── ComplaintRepository.java
│   └── DistrictRepository.java
├── config/
│   ├── SecurityConfig.java         # Spring Security configuration
│   ├── JwtFilter.java              # JWT authentication filter
│   ├── CloudinaryConfiguration.java # Cloudinary setup
│   └── CorsConfig.java             # CORS configuration
├── util/
│   └── JWTUtil.java                # JWT utility functions
└── exceptions/                     # Custom exceptions
    ├── BadRequesException.java
    ├── ConflictException.java
    ├── UnauthorizedException.java
    └── InternalServerError.java
```

## 🔌 API Endpoints

### Authentication (`/auth`)
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login with JWT token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with OTP

### Complaints (`/complaints`)
- `GET /complaints` - Get all complaints
- `POST /complaints` - Create new complaint
- `GET /complaints/{id}` - Get complaint details
- `PUT /complaints/{id}` - Update complaint

### Admin (`/admin`)
- `POST /admin/district-admin` - Add district administrator
- `GET /admin/complaints` - Get all complaints for district
- `PUT /admin/complaints/{id}/status` - Update complaint status
- `GET /admin/super-admins` - List all district admins (paginated)
- `DELETE /admin/district-admin/{id}` - Delete district admin
- `GET /admin/stats` - Get dashboard statistics

### Users (`/users`)
- User profile management
- User-specific operations

## 🔐 Security Features

- **JWT Token Authentication**: All protected endpoints require valid JWT tokens
- **Password Encryption**: Passwords are encoded using BCrypt
- **CORS Configuration**: Configured for secure cross-origin requests
- **Role-Based Authorization**: Different endpoints accessible based on user role
- **Email Verification**: OTP-based email verification for password reset

## 🗄️ Database Schema

### User Table
- `id` (Long, PK)
- `email` (String, Unique)
- `username` (String)
- `password` (String, Encrypted)
- `role` (Enum: ADMIN, DISTRICT_ADMIN, USER)
- `district_id` (FK to District)

### Complaint Table
- `id` (Long, PK)
- `title` (String)
- `description` (Text)
- `status` (Enum: PENDING, IN_PROGRESS, RESOLVED)
- `district_id` (FK to District)
- `user_id` (FK to User)
- `image_url` (String, Cloudinary URL)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### District Table
- `id` (Long, PK)
- `name` (String, Unique)

## 📦 Dependencies

Key Dependencies:
- Spring Boot Data JPA
- Spring Security
- Spring Boot Validation
- Lombok
- PostgreSQL Driver
- JJWT (JWT Library)
- Cloudinary HTTP5 Client
- Spring Mail

## 🚀 Getting Started

### Prerequisites
- Java 17+
- PostgreSQL
- Maven 3.6+
- Git

### Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Set up environment variables**
   Create a `.env` file or configure environment variables:
   ```
   POSTGRES_URL=jdbc:postgresql://localhost:5432/wastemanagement
   POSTGRES_USER=your_db_user
   POSTGRES_PASSWORD=your_db_password
   JWT_SECRET_KEY=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password
   DISTRICT_NAME=your_district
   ADMIN_EMAIL=admin@email.com
   ADMIN_PASSWORD=admin_password
   FRONTEND_URL=http://localhost:3000
   ```

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   Or use the packaged JAR:
   ```bash
   java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```

5. **Access the API**
   - API Base URL: `http://localhost:8080/api`
   - Health Check: `http://localhost:8080/api/actuator/health`

## 🐳 Docker Support

Build and run using Docker:

```bash
docker build -t wastemanagement-backend .
docker run -p 8080:8080 --env-file .env wastemanagement-backend
```

## 📝 API Response Format

All API responses follow a standard format:

```json
{
  "status": "OK",
  "timestamp": "2026-03-28T12:30:45",
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## ⚠️ Error Handling

The API includes comprehensive error handling with custom exceptions:
- **BadRequesException** (400): Invalid request data
- **ConflictException** (409): Resource already exists
- **UnauthorizedException** (401): Invalid credentials or insufficient permissions
- **InternalServerError** (500): Server-side errors

## 🧪 Testing

Run the test suite:

```bash
mvn test
```

Test files are located in `src/test/java/`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact & Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the project maintainers.

## 🔄 Version History

- **0.0.1-SNAPSHOT** - Initial release with core features

---

**Built with ❤️ for better waste management**

