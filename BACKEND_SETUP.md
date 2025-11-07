# Backend Setup Guide

This guide explains how to set up the backend infrastructure for real user authentication and data management alongside the existing demo mode.

## Overview

The application now supports two modes:
- **Demo Mode**: Uses localStorage and mock data (existing functionality)
- **Real Mode**: Uses database and proper authentication for actual users

## Quick Setup

1. **Install Dependencies**
```bash
npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
```

2. **Database Setup** (Choose one)

### Option A: PostgreSQL
```bash
# Install PostgreSQL
npm install pg @types/pg

# Create database
createdb designcart

# Set environment variable
DATABASE_URL="postgresql://username:password@localhost:5432/designcart"
```

### Option B: MySQL
```bash
# Install MySQL
npm install mysql2

# Create database
mysql -u root -p
CREATE DATABASE designcart;

# Set environment variable
DATABASE_URL="mysql://username:password@localhost:3306/designcart"
```

### Option C: MongoDB
```bash
# Install MongoDB
npm install mongodb

# Set environment variable
DATABASE_URL="mongodb://localhost:27017/designcart"
```

3. **Environment Configuration**
```bash
cp .env.local.example .env.local
# Edit .env.local with your actual values
```

4. **Database Schema** (For SQL databases)
```sql
-- Users table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  scope VARCHAR(255) NOT NULL,
  budget DECIMAL(10,2),
  status ENUM('active', 'completed', 'paused') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_address JSON NOT NULL,
  billing_address JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE order_items (
  id VARCHAR(255) PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  project_id VARCHAR(255),
  area VARCHAR(255),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Cart items table
CREATE TABLE cart_items (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  project_id VARCHAR(255),
  area VARCHAR(255),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat messages table
CREATE TABLE chat_messages (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  project_id VARCHAR(255) NOT NULL,
  sender ENUM('user', 'agent') NOT NULL,
  message TEXT NOT NULL,
  attachments JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

### Cart
- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item

## Usage

### Frontend Integration

The `useAuth` hook automatically handles both demo and real modes:

```tsx
import { useAuth } from '@/lib/auth/authContext';

function MyComponent() {
  const { user, isDemo, signIn, signOut, switchToDemo, switchToReal } = useAuth();

  if (isDemo) {
    // User is in demo mode
    return <div>Demo Mode: {user?.name}</div>;
  } else {
    // User is in real mode
    return <div>Real Mode: {user?.name}</div>;
  }
}
```

### Mode Switching

Users can switch between demo and real modes:

```tsx
function ModeToggle() {
  const { isDemo, switchToDemo, switchToReal } = useAuth();

  return (
    <div>
      <button onClick={switchToDemo} disabled={isDemo}>
        Demo Mode
      </button>
      <button onClick={switchToReal} disabled={!isDemo}>
        Real Mode
      </button>
    </div>
  );
}
```

## Security Considerations

1. **Password Hashing**: Uses bcrypt with 12 salt rounds
2. **JWT Tokens**: Stored in HTTP-only cookies
3. **Input Validation**: All API endpoints validate input
4. **SQL Injection**: Use parameterized queries
5. **Rate Limiting**: Consider adding rate limiting for API endpoints

## Production Deployment

1. **Database**: Use managed database service (AWS RDS, Google Cloud SQL, etc.)
2. **Environment Variables**: Set proper production values
3. **HTTPS**: Ensure all traffic is encrypted
4. **Monitoring**: Add logging and error tracking
5. **Backups**: Set up automated database backups

## Migration from Demo to Real

Users can migrate their demo data to real accounts:

```tsx
async function migrateDemoData() {
  // Get demo data from localStorage
  const demoCart = localStorage.getItem('dc:cart');
  const demoProjects = localStorage.getItem('dc:projects');
  
  // Create real account
  await signUp(email, name, password);
  
  // Transfer data via API
  if (demoCart) {
    await fetch('/api/cart/migrate', {
      method: 'POST',
      body: JSON.stringify({ demoData: JSON.parse(demoCart) })
    });
  }
}
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Verify DATABASE_URL is correct
2. **JWT Errors**: Ensure JWT_SECRET is set and consistent
3. **Cookie Issues**: Check sameSite and secure settings
4. **CORS**: Configure CORS for API routes if needed

### Development Tips

1. Use `console.log` in API routes for debugging
2. Check Network tab in browser dev tools
3. Verify database connections with a simple test query
4. Use Postman or similar for API testing