# Tarnished Tactics Backend - Comprehensive Feature Overview

**Deployed Backend:** https://tarnished-tactics-backend.uc.r.appspot.com


**Please see frontend readme or piazza post for all screenshots. This is the backend repository.**

---

## API Structure
**Feature Description:**  
RESTful API architecture with comprehensive endpoint coverage and robust error handling.

**How It Works:**
- **Full CRUD Operations:** Complete Create, Read, Update, Delete functionality for all resources
- **Standardized Response Format:** Consistent JSON responses with proper HTTP status codes
- **Comprehensive Error Handling:** Detailed error messages with validation feedback
- **Request Validation:** Input sanitization and data validation for all endpoints
- **CORS Configuration:** Cross-Origin Resource Sharing enabled for frontend integration
- **Environment-Based Configuration:** Development and production environment support

---

## Database Architecture
**Feature Description:**  
Production-ready MongoDB Atlas database with optimized collections and data modeling.

**How It Works:**
- **MongoDB Atlas Integration:** Cloud-hosted database with high availability
- **Multi-Collection Structure:** Separate collections for builds, guides, and user data
- **Data Relationships:** Proper linking between builds and guides with user attribution
- **Sample Data Seeding:** Starter builds and guides for immediate user experience
- **Index Optimization:** Database indexes for improved query performance
- **Data Persistence:** Reliable storage with automated backups and scaling

---

## Authentication System
**Feature Description:**  
Google OAuth integration with secure user management and session handling.

**How It Works:**
- **Google Identity Services:** OAuth 2.0 authentication with Google accounts
- **JWT Token Management:** Secure token-based authentication system
- **User Profile Storage:** Automatic user registration with Google profile data
- **Session Security:** Proper token validation and expiration handling
- **CORS-Compliant Auth:** Cross-origin authentication support for frontend integration
- **Privacy Controls:** User data handling with appropriate security measures

---

## AI Guide Generation
**Feature Description:**  
OpenAI API integration for intelligent, personalized strategy guide creation.

**How It Works:**
- **OpenAI API Integration:** GPT-powered content generation using latest models
- **Build Analysis Engine:** Intelligent parsing of build statistics, equipment, and class data
- **Personalized Content Creation:** Custom guides tailored to specific build configurations
- **Strategy Optimization:** AI-generated recommendations for combat tactics and progression
- **Universal Build Compatibility:** Works with any build (user-created, community, or preset)
- **Real-time Generation:** Fast API response times with formatted guide output
- **Content Validation:** AI-generated content review and formatting for consistency

---

## Comprehensive Endpoints
**Feature Description:**  
Complete API endpoint coverage for all application functionality with proper HTTP methods.

**How It Works:**

### Builds Endpoints:
- `GET /api/v1/builds` - Retrieve all public builds with pagination
- `POST /api/v1/builds` - Create new build with user authentication
- `GET /api/v1/builds/:id` - Get specific build details
- `PUT /api/v1/builds/:id` - Update build (owner authentication required)
- `DELETE /api/v1/builds/:id` - Delete build (owner authentication required)

### Guides Endpoints:
- `GET /api/v1/guides` - List all guides with metadata
- `POST /api/v1/guides` - Create manual guide with rich content
- `GET /api/v1/guides/:id` - Retrieve detailed guide information
- `PUT /api/v1/guides/:id` - Update guide content (owner authentication)
- `DELETE /api/v1/guides/:id` - Remove guide (owner authentication)


---

## Deployment & Infrastructure
**Feature Description:**  
Production-ready deployment on Google Cloud with scalable architecture and monitoring.

**How It Works:**
- **Google Cloud App Engine:** Serverless deployment with automatic scaling
- **Environment Variables:** Secure configuration management for API keys and database connections
- **Production Monitoring:** Health checks and error logging for system reliability
- **HTTPS Security:** SSL/TLS encryption for all API communications
- **Cold Start Optimization:** Efficient startup times and resource management
- **Load Balancing:** Automatic request distribution and high availability
- **Database Security:** Encrypted connections to MongoDB Atlas with IP restrictions

---

## Data Access Layer
**Feature Description:**  
Abstracted database operations with optimized query handling and data consistency.

**How It Works:**
- **DAO Pattern Implementation:** BuildsDAO and GuidesDAO classes for clean data access
- **MongoDB Query Optimization:** Efficient database queries with proper indexing
- **Error Handling:** Comprehensive database error management and logging
- **Data Validation:** Server-side validation for all database operations
- **Transaction Support:** Atomic operations for data consistency
- **Connection Pooling:** Optimized database connection management for performance

---

## Enhanced Features (Iteration 3)
**Feature Description:**  
Advanced functionality improvements and accuracy enhancements for core features.

**How It Works:**
- **Accurate Level Calculation:** Improved build level computation starting from level 1 base
- **Flexible Stat Allocation:** Support for zero-based stat allocation with proper validation
- **Enhanced AI Integration:** Refined OpenAI prompts for higher quality guide generation
- **Build Ownership Validation:** Secure build modification with proper user authentication
- **Guide-Build Relationships:** Proper linking and association between guides and source builds
- **Performance Optimization:** Reduced API response times and improved query efficiency

---

**STATUS:** Production backend serving live data with full feature parity, AI integration, and secure authentication to frontend application.

TARNISHED TACTICS BACKEND - TODAY'S FEATURES

Deployed backend: 
https://tarnished-tactics-backend.uc.r.appspot.com/

API STRUCTURE
- API endpoints for builds and guides
- Proper error handling and validation

DATABASE
- MongoDB Atlas connection (production-ready)
- Two collections: builds and guides
- Sample data: "Starter Build" and "Basic Combat Guide"

ENDPOINTS
- GET /api/v1/builds - List all builds
- GET /api/v1/guides - List all guides  
- Full CRUD operations for both resources

DEPLOYMENT
- Deployed on Google Cloud App Engine
- Environment variables configured
- CORS enabled for frontend connection
- Live at: https://tarnished-tactics-backend.uc.r.appspot.com

DATA ACCESS LAYER
- BuildsDAO and GuidesDAO classes
- Proper MongoDB query handling

STATUS: Production backend serving live data to frontend
