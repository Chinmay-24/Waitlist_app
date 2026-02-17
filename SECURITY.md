# Security Implementation Guide

## Overview
This document outlines all security measures implemented in the Resto Project application to protect user data, prevent unauthorized access, and ensure secure communication between frontend and backend.

---

## 1. BACKEND SECURITY

### 1.1 Environment Variables
- **Location**: `.env` file in backend root
- **Purpose**: Store sensitive configuration away from code
- **Key Variables**:
  - `JWT_SECRET`: Used to sign and verify JSON Web Tokens
  - `JWT_EXPIRE`: Token expiration time (default: 7d)
  - `ALLOWED_ORIGINS`: CORS whitelist (only localhost:3000 by default)
  - `RATE_LIMIT_*`: Rate limiting configuration
  - `DB_*`: Database credentials

**Best Practices**:
- Never commit `.env` file to version control
- Use strong, unique secrets in production (minimum 32 characters)
- Rotate secrets periodically
- Use different secrets for different environments

### 1.2 HTTP Security Headers (Helmet.js)
Automatically sets security headers:
- `Content-Security-Policy`: Prevents XSS attacks
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: MIME type sniffing prevention
- `Strict-Transport-Security`: Forces HTTPS (in production)
- `Referrer-Policy`: Controls referrer information

### 1.3 Input Validation & Sanitization
**Backend Protection**:
- Email format validation using regex
- Password strength requirements (min 8 chars, 1 uppercase, 1 number)
- Input length limiting (max 200 characters for strings)
- MongoDB NoSQL injection prevention via `express-mongo-sanitize`
- Parameter pollution prevention via `hpp` (HTTP Parameter Pollution)

**Example - Auth Controller Validation**:
```javascript
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one number
  const re = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(password);
};
```

### 1.4 Rate Limiting
**Configuration**:
- General API: 100 requests per 15 minutes per IP
- Authentication: 5 requests per 15 minutes per IP (stricter)
- Localhost (127.0.0.1, ::1) is exempt

**Purpose**: Prevents brute force attacks and DDoS

### 1.5 Password Security
- **Hashing**: bcryptjs with 10 rounds (configurable via `BCRYPT_ROUNDS`)
- **Never Stored Plain Text**: All passwords are hashed
- **Never Returned in API**: Responses exclude password field

### 1.6 JWT Authentication
**Token Structure**:
```javascript
{
  userId: "user_id",
  email: "user@email.com",
  role: "user|owner|admin",
  iat: 1234567890,
  exp: 1234654290
}
```

**Security Features**:
- Tokens are signed with `JWT_SECRET`
- Include expiration time (default 7 days)
- Included in `Authorization: Bearer <token>` header
- Verified on every protected request
- Expired tokens are rejected

### 1.7 Role-Based Access Control (RBAC)
**Available Roles**:
- `user`: Regular user (default)
- `owner`: Restaurant owner
- `admin`: Administrator with all permissions

**Middleware Functions**:
```javascript
authMiddleware          // Requires authentication
adminMiddleware         // Requires admin role
ownerMiddleware         // Requires owner or admin role
waitingListMiddleware   // Restricted waiting list access
optionalAuthMiddleware  // Optional authentication
```

**Protected Endpoints Example**:
```
POST   /api/restaurants          - Requires owner role
DELETE /api/restaurants/:id      - Requires admin role
POST   /api/orders/:id/status    - Requires admin role
POST   /api/reviews              - Requires authentication
```

### 1.8 CORS Configuration
- **Whitelist**: Only `localhost:3000` by default
- **Methods**: GET, POST, PUT, DELETE, PATCH
- **Headers**: Content-Type, Authorization
- **Credentials**: Allowed for same-origin requests
- **Max Age**: 24 hours

### 1.9 Error Handling
- **Production Mode**: Generic error messages (no stack traces)
- **Development Mode**: Detailed error information for debugging
- **Never Expose**: Database details, file paths, internal logic
- **Error Codes**: Specific error codes for client-side handling

---

## 2. FRONTEND SECURITY

### 2.1 Environment Variables
- **Location**: `.env` file in frontend root
- **Purpose**: Configure API endpoints and feature flags
- **Variables**:
  - `REACT_APP_API_URL`: Backend API URL
  - `REACT_APP_SESSION_TIMEOUT`: Auto-logout timeout
  - `REACT_APP_ENABLE_REQUEST_LOGGING`: Debug mode

### 2.2 Secure Token Storage
**Method**: SessionStorage (not LocalStorage)
**Advantages**:
- Cleared when browser window/tab closes
- Not vulnerable to some XSS attacks that target localStorage
- Automatic expiry based on configured timeout

**Implementation**:
```javascript
// Token is stored with expiry time
sessionStorage.setItem('auth_token', token);
sessionStorage.setItem('auth_token_expiry', expiryTime);

// Automatically cleared on expiry or logout
```

### 2.3 XSS Prevention
- React automatically escapes JSX values
- No use of `dangerouslySetInnerHTML`
- Input sanitization on frontend forms
- Content Security Policy headers from backend

### 2.4 CSRF Protection
- `X-Requested-With: XMLHttpRequest` header on all requests
- Same-origin policy enforcement via CORS
- State-based session management

### 2.5 API Request Security
**Request Interceptor**:
- Automatically adds authentication token
- Validates token expiry before each request
- Logs requests in development mode only

**Response Interceptor**:
- Handles 401 (Unauthorized) by clearing token and redirecting to login
- Handles 403 (Forbidden) with proper error messaging
- Provides error context for user feedback

### 2.6 Auto-Logout
- **Timeout**: 1 hour by default (configurable)
- **Triggered**: When token expires or user is inactive
- **Behavior**: Redirects to login, clears session

### 2.7 Sensitive Data Handling
- Passwords never sent in plain text
- No sensitive data in console logs (production)
- No sensitive data in error messages
- Tokens excluded from response parameters

---

## 3. USER & WAITING LIST SECURITY

### 3.1 Waiting List Protection
**Current Status**: `HIDE_WAITING_LIST_FROM_PUBLIC=true`

**Access Control**:
- Only registered users can view their own waiting list
- Admins can view all waiting lists (via `/api/admin/waiting-list`)
- General public cannot access any waiting list data
- Email addresses are partially hidden in public views

### 3.2 User Data Privacy
- Profile information private to user
- Email not exposed in public endpoints
- Personal preferences encrypted in future versions
- GDPR-compliant data handling

### 3.3 User Roles
- Regular users have limited access
- Cannot access admin functions
- Cannot access other users' data
- Cannot modify restaurant information

---

## 4. DATABASE SECURITY

### 4.1 Connection Security
- Database URL stored in environment variables
- MongoDB user credentials required
- SSL/TLS recommended for remote connections
- Localhost used by default (no remote exposure)

### 4.2 Data Protection
- Passwords hashed with bcryptjs
- Sensitive fields excluded from unnecessary queries
- NoSQL injection prevented via sanitization
- User data segregation by authentication

---

## 5. NETWORK SECURITY

### 5.1 HTTPS (In Production)
- Enforce SSL/TLS certificates
- Redirect HTTP to HTTPS
- Set Strict-Transport-Security header

### 5.2 Backend Exposure Prevention
**Current Setup**:
- Backend runs on localhost:5000 (not internet-facing)
- Only frontend communicates with backend
- CORS blocks unknown origins
- Rate limiting prevents abuse

**Production Recommendations**:
- Deploy behind reverse proxy (nginx, Apache)
- Use API Gateway for additional protection
- Implement Web Application Firewall (WAF)
- Use VPN/SSH tunnels for remote management

---

## 6. SECURITY CHECKLIST

### Immediate Actions
- [x] Set strong JWT_SECRET (minimum 32 characters)
- [x] Configure ALLOWED_ORIGINS for your domain
- [x] Enable HTTPS in production
- [x] Set NODE_ENV=production
- [ ] Generate strong database credentials
- [ ] Implement HTTPS certificates
- [ ] Set up monitoring and logging

### Regular Maintenance
- [ ] Review and rotate secrets monthly
- [ ] Update dependencies regularly (`npm audit fix`)
- [ ] Monitor rate limiting statistics
- [ ] Audit user access logs
- [ ] Test authentication flows
- [ ] Update security policies

### Production Deployment
- [ ] Use environment-specific configs
- [ ] Enable CORS for production domain only
- [ ] Set secure session cookies
- [ ] Configure firewall rules
- [ ] Set up DDoS protection
- [ ] Enable request logging and monitoring
- [ ] Implement backup strategy
- [ ] Create incident response plan

---

## 7. CONFIGURATION FOR DIFFERENT ENVIRONMENTS

### Development (.env.development)
```
NODE_ENV=development
JWT_SECRET=dev_secret_key_change_in_production
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_MAX_REQUESTS=1000  # Higher for testing
```

### Production (.env.production)
```
NODE_ENV=production
JWT_SECRET=<STRONG_SECRET_MIN_32_CHARS>
ALLOWED_ORIGINS=https://yourdomain.com
RATE_LIMIT_MAX_REQUESTS=100   # Stricter
HTTPS_ONLY=true
```

---

## 8. INCIDENT RESPONSE

### If Breach Detected
1. **Immediately**:
   - Revoke all active tokens
   - Reset all user passwords
   - Notify affected users
   - Rotate JWT secret

2. **Within 24 Hours**:
   - Analyze security logs
   - Identify attack vector
   - Patch vulnerability
   - Deploy fix and monitor

3. **Within 7 Days**:
   - Complete security audit
   - Update security policies
   - Implement additional controls
   - Document lessons learned

---

## 9. SECURITY TESTING

### Manual Testing
```bash
# Test strong password requirement
# Test rate limiting (multiple failed attempts)
# Test token expiry
# Test unauthorized access attempts
# Test CORS from different origins
```

### Automated Testing
```bash
# npm audit - Check for vulnerable dependencies
# OWASP ZAP - Automated security scanning
# Burp Suite - Manual penetration testing
```

---

## 10. SECURITY RESOURCES

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CWE - Common Weakness Enumeration](https://cwe.mitre.org/)

---

## Support & Questions

For security concerns or vulnerabilities, please contact security team immediately.
Do not disclose security issues publicly.

**Updated**: February 17, 2026
**Version**: 1.0
