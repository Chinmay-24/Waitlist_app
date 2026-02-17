# 🔐 SECURITY CHECKLIST & GUIDELINES

## Pre-Deployment Security Checklist

### Backend Configuration
- [ ] **Secrets Generated**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  - [ ] JWT_SECRET (32+ characters)
  - [ ] JWT_REFRESH_SECRET
  - [ ] SESSION_SECRET

- [ ] **Environment Variables Set**
  - [ ] NODE_ENV=production
  - [ ] Secrets populated from secure storage
  - [ ] ALLOWED_ORIGINS set to production domain
  - [ ] Database credentials configured
  - [ ] Rate limiting values reviewed

- [ ] **HTTPS Configured**
  - [ ] SSL/TLS certificate installed
  - [ ] HSTS header enabled
  - [ ] HTTP redirects to HTTPS
  - [ ] Certificate auto-renewal configured

- [ ] **Database Security**
  - [ ] Authentication enabled
  - [ ] User credentials set
  - [ ] SSL/TLS connections configured
  - [ ] Backups automated and tested
  - [ ] Access logs monitored

### Frontend Configuration
- [ ] **Environment Variables Set**
  - [ ] REACT_APP_API_URL points to production backend
  - [ ] REACT_APP_ENV=production
  - [ ] REACT_APP_ENABLE_REQUEST_LOGGING=false

- [ ] **Built for Production**
  ```bash
  npm run build
  ```
  - [ ] Build optimized
  - [ ] Source maps excluded
  - [ ] Minified assets
  - [ ] No console logs in production

### Deployment Infrastructure
- [ ] **Server Hardening**
  - [ ] Firewall configured
  - [ ] Only necessary ports exposed
  - [ ] SSH key-based authentication only
  - [ ] Failed login attempts logged
  - [ ] Rate limiting at network level

- [ ] **Monitoring & Logging**
  - [ ] Error tracking configured (Sentry/DataDog)
  - [ ] Request logging enabled
  - [ ] Performance monitoring active
  - [ ] Security alerts configured
  - [ ] Backup verification scheduled

- [ ] **DDoS Protection**
  - [ ] CDN configured (Cloudflare)
  - [ ] Rate limiting at edge
  - [ ] Geographic blocking if needed
  - [ ] Incident response plan

---

## Security Testing Checklist

### Authentication Tests
- [ ] Register with:
  - [ ] Valid credentials → Success
  - [ ] Weak password → Error message
  - [ ] Already registered email → Error
  - [ ] Invalid email format → Error

- [ ] Login with:
  - [ ] Correct credentials → Token returned
  - [ ] Wrong password → Generic error (no enumeration)
  - [ ] Non-existent email → Generic error
  - [ ] Multiple rapid attempts → Rate limited

- [ ] Token expiry:
  - [ ] Access expired token → 401 error
  - [ ] Old token → Auto-logout triggered
  - [ ] Malformed token → Rejected

### Authorization Tests
- [ ] User accessing:
  - [ ] /api/auth/profile → Success
  - [ ] /api/bookings → Own bookings only
  - [ ] /api/restaurants → Public data
  - [ ] Admin endpoint → 403 Forbidden

- [ ] Admin accessing:
  - [ ] All admin endpoints → Success
  - [ ] Create restaurant → Success
  - [ ] Delete user → Success
  - [ ] Manage waiting lists → Success

### Input Validation Tests
- [ ] Register form:
  - [ ] Empty fields → Error
  - [ ] Email: "test" → Invalid format error
  - [ ] Password: "short" → Weak password error
  - [ ] XSS attempt in name → Sanitized

- [ ] Booking form:
  - [ ] Negative guests → Error
  - [ ] Past date → Error
  - [ ] Special characters → Sanitized

### API Security Tests
- [ ] CORS:
  - [ ] Request from localhost:3000 → Allowed
  - [ ] Request from other domain → Blocked
  - [ ] Content-Type validation → Enforced

- [ ] Rate Limiting:
  - [ ] 100 requests/15min → Allowed
  - [ ] 101st request → 429 Too Many Requests
  - [ ] 5 auth attempts/15min → Allowed
  - [ ] 6th auth attempt → 429 Too Many Requests

- [ ] Headers:
  - [ ] X-Frame-Options: DENY → Set
  - [ ] X-Content-Type-Options: nosniff → Set
  - [ ] Content-Security-Policy → Set
  - [ ] Strict-Transport-Security → Set (HTTPS)

### Waiting List Tests
- [ ] Public user accessing:
  - [ ] GET /api/waiting-list → 403 Forbidden
  - [ ] Waiting list data → Not visible

- [ ] Admin accessing:
  - [ ] GET /api/waiting-list → Success
  - [ ] Managing entries → Allowed

### Frontend Security Tests
- [ ] Token storage:
  - [ ] Close browser tab → Token cleared
  - [ ] Session timeout → Auto-logout
  - [ ] No token in localStorage → Verified
  - [ ] SessionStorage used → Verified

- [ ] XSS Tests:
  - [ ] Input: `<script>alert('xss')</script>` → Escaped
  - [ ] No dangerouslySetInnerHTML → Verified
  - [ ] Console errors → None

---

## Incident Response Checklist

### If Security Breach Detected

**Immediate (0-1 hour)**
- [ ] Take affected systems offline if necessary
- [ ] Notify security team
- [ ] Begin collecting evidence/logs
- [ ] Document timeline of events
- [ ] Set up war room (Slack channel, meeting)

**Short Term (1-24 hours)**
- [ ] Revoke all active tokens
- [ ] Reset admin credentials
- [ ] Force password reset for affected users
- [ ] Patch vulnerability
- [ ] Deploy fix to production
- [ ] Notify affected users
- [ ] Enable monitoring/alerts

**Medium Term (1-7 days)**
- [ ] Complete security audit
- [ ] Analyze attack vector
- [ ] Update incident response plan
- [ ] Implement additional controls
- [ ] Conduct team training/debrief
- [ ] Update security documentation

**Long Term (Ongoing)**
- [ ] Monitor for signs of continued activity
- [ ] Implement preventive measures
- [ ] Regular security testing
- [ ] Keep team training current

---

## Regular Maintenance Schedule

### Daily
- [ ] Monitor error logs
- [ ] Check rate limit metrics
- [ ] Review failed login attempts
- [ ] Verify backups completed

### Weekly
- [ ] Review access logs
- [ ] Test monitoring/alerting
- [ ] Check for security advisories
- [ ] Update dependencies if needed

### Monthly
- [ ] Full security audit
- [ ] Rotate API keys (if applicable)
- [ ] Review user access levels
- [ ] Update password policy
- [ ] Penetration testing

### Quarterly
- [ ] Full system security review
- [ ] Update security policies
- [ ] Team security training
- [ ] Disaster recovery testing
- [ ] Compliance review

### Annually
- [ ] Major security assessment
- [ ] Penetration testing by external firm
- [ ] Update incident response plan
- [ ] Security certification review
- [ ] Policy updates

---

## Security Documentation

### Essential Documents
- [ ] SECURITY.md - Comprehensive security implementation
- [ ] SECURITY_SUMMARY.md - Quick reference guide
- [ ] .env.example - Configuration template
- [ ] README.md - Security features listed
- [ ] INCIDENT_RESPONSE.md - Plan for breaches
- [ ] ACCESS_CONTROL.md - Role definitions

### Team Knowledge
- [ ] All developers trained on security practices
- [ ] Security champions identified
- [ ] Code review process includes security
- [ ] New hires get security training
- [ ] Security best practices documented

---

## Common Vulnerabilities - Prevention Guide

### 1. SQL/NoSQL Injection
- ✅ Using: `express-mongo-sanitize` middleware
- ✅ Input validation on all endpoints
- ✅ Parameterized queries (MongoDB)

**Test**: Input: `{"$ne": null}` → Should be sanitized

### 2. Cross-Site Scripting (XSS)
- ✅ Using: React auto-escaping
- ✅ CSP headers from Helmet
- ✅ No dangerouslySetInnerHTML

**Test**: Input: `<img src=x onerror=alert(1)>` → Should not execute

### 3. Cross-Site Request Forgery (CSRF)
- ✅ Using: JWT tokens + SOP
- ✅ X-Requested-With headers
- ✅ CORS whitelist

**Test**: POST from external site → Should be blocked

### 4. Brute Force Attacks
- ✅ Using: Rate limiting (5 auth/15min)
- ✅ Account lockout not implemented yet
- ✅ Login attempt logging

**Test**: 10 failed attempts → Should be rate limited

### 5. Sensitive Data Exposure
- ✅ Using: TLS/HTTPS in production
- ✅ Passwords hashed with bcryptjs
- ✅ Sensitive fields excluded from responses

**Test**: GET /api/users/:id.password → Should not return

### 6. Broken Authentication
- ✅ Using: JWT with expiry
- ✅ SecureSession storage
- ✅ Password strength requirements

**Test**: Expired token → Should be rejected

### 7. Insecure Deserialization
- ✅ Using: JSON parsing only
- ✅ No eval() or Function() constructors
- ✅ Type validation

**Test**: Binary data → Should be rejected

### 8. Security Misconfiguration
- ✅ Using: Environment variables
- ✅ Error messages generic in production
- ✅ Unnecessary headers removed
- ✅ Directory listing disabled

**Test**: GET /nonexistent.json → 404 error only

### 9. Using Components with Known Vulnerabilities
- ✅ Using: `npm audit` regularly
- ✅ Automated dependency updates
- ✅ Version pinning for stability

**Test**: `npm audit` → Should show 0 vulnerabilities

### 10. Insufficient Logging & Monitoring
- ✅ Using: Error tracking service
- ✅ Request logging (development)
- ✅ Failed attempt tracking

**Test**: Check logs for security events → Should be logged

---

## Security Contact

**Email**: security@restoproject.com  
**Response SLA**: 24 hours  
**Escalation**: security-team@restoproject.com

**Do NOT**:
- Disclose vulnerabilities publicly
- Test on production without approval
- Share credentials via email
- Commit secrets to git

**Do**:
- Report privately
- Allow time for fix
- Follow responsible disclosure
- Provide reproduction steps

---

**Last Updated**: February 17, 2026  
**Version**: 1.0  
**Status**: Active & Maintained
