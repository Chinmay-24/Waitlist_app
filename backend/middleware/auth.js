const jwt = require('jsonwebtoken');

// ============================
// CORE AUTHENTICATION MIDDLEWARE
// ============================
const authMiddleware = (req, res, next) => {
  try {
    // Extract bearer token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NO_AUTH_TOKEN'
      });
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user information to request
    req.userId = decoded.userId;
    req.userRole = decoded.role || 'user';
    req.userEmail = decoded.email;
    req.tokenIssuedAt = decoded.iat;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    res.status(401).json({ 
      error: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};

// ============================
// ADMIN-ONLY MIDDLEWARE
// ============================
const adminMiddleware = (req, res, next) => {
  // First check if user is authenticated
  authMiddleware(req, res, () => {
    // Then check if user has admin role
    if (req.userRole !== 'admin') {
      return res.status(403).json({ 
        error: 'Access denied. Admin privileges required.',
        code: 'NOT_ADMIN'
      });
    }
    next();
  });
};

// ============================
// OWNER-ONLY MIDDLEWARE
// ============================
const ownerMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.userRole !== 'owner' && req.userRole !== 'admin') {
      return res.status(403).json({ 
        error: 'Access denied. Owner privileges required.',
        code: 'NOT_OWNER'
      });
    }
    next();
  });
};

// ============================
// WAITING LIST ACCESS CONTROL
// ============================
const waitingListMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    // Only admins can view/manage waiting lists
    if (process.env.REQUIRE_ADMIN_FOR_WAITING_LIST === 'true' && req.userRole !== 'admin') {
      return res.status(403).json({ 
        error: 'Access denied. Waiting list is restricted.',
        code: 'WAITING_LIST_RESTRICTED'
      });
    }
    next();
  });
};

// ============================
// OPTIONAL AUTHENTICATION (Public with user context)
// ============================
const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.userId = decoded.userId;
      req.userRole = decoded.role || 'user';
      req.authenticated = true;
    } else {
      req.authenticated = false;
    }
    next();
  } catch (error) {
    // Even if token is invalid, continue as public user
    req.authenticated = false;
    next();
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  ownerMiddleware,
  waitingListMiddleware,
  optionalAuthMiddleware
};
