# 🔐 Password & Secret Management Guide

## Important: Never commit secrets to Git

Your `.env` file should NEVER be committed to version control. It's already in `.gitignore`.

---

## Generating Secure Secrets

### Method 1: Using Node.js (Recommended)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This generates a 256-bit (64-character hex) random secret.

### Method 2: Using OpenSSL
```bash
openssl rand -hex 32
```

### Method 3: Using Python
```bash
python -c "import os; print(os.urandom(32).hex())"
```

---

## Secret Requirements

### JWT_SECRET
- **Minimum**: 32 characters
- **Recommended**: 64 characters (256-bit)
- **Complexity**: Random alphanumeric + special characters
- **Rotation**: Every 90 days in production
- **Example**: `a3f7b9c2e8d4f1a6b5c7d9e2f4a8c1d3e5f7b9a0c2d4e6f8a1b3c5d7e9f1a3b`

### Database Password
- **Minimum**: 16 characters
- **Requirements**: 
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character (!@#$%^&*)
- **Example**: `Db@Secure2024!Pwd`

### Session Secret
- **Minimum**: 32 characters
- **Requirements**: Strong random entropy
- **Example**: Generate same way as JWT_SECRET

### Admin Password (Initial)
- **Minimum**: 12 characters
- **Requirements**:
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character
- **Change**: Immediately after first login
- **Example**: `Admin@2024!Pass`

---

## Environment Variables Checklist

### `.env` File (Backend)
```dotenv
# ✅ MUST HAVE
NODE_ENV=production
JWT_SECRET=<GENERATE_NEW>
JWT_EXPIRE=7d
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db
ALLOWED_ORIGINS=https://yourdomain.com

# ✅ RECOMMENDED
BCR YPT_ROUNDS=10
RATE_LIMIT_MAX_REQUESTS=100
SESSION_SECRET=<GENERATE_NEW>

# ❌ NEVER
# - Commit to git
# - Share via email
# - Log to console
# - Hardcode in code
```

### `.env` File (Frontend)
```dotenv
# ✅ OK TO COMMIT (Public)
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENV=production
REACT_APP_SESSION_TIMEOUT=3600000

# ❌ NEVER COMMIT
# - API keys
# - Secrets
# - Private credentials
```

---

## Secret Rotation Schedule

### Immediate
- [ ] On production deployment
- [ ] After security incident
- [ ] If secret suspected compromised

### Regular Rotation
| Secret | Current | Previous | Interval |
|--------|---------|----------|----------|
| JWT_SECRET | Active | Honored | 90 days |
| DB Password | Active | Disabled | 6 months |
| Session Secret | Active | Honored | 90 days |
| API Keys | Active | Revoked | 180 days |

### Rotation Process
1. Generate new secret
2. Deploy with both old and new
3. Update code to use new
4. Monitor for errors (24-48 hours)
5. Remove old secret
6. Document rotation date

---

## Password Policy

### User Passwords
- **Minimum**: 8 characters
- **Requirements**:
  - At least 1 uppercase letter (A-Z)
  - At least 1 number (0-9)
- **Not allowed**:
  - Previous 5 passwords (not tracking yet)
  - Common patterns (123456, password, etc.)
- **Examples**:
  - ✅ SecurePass123
  - ✅ MyApp2024!
  - ✅ P@ssw0rd
  - ❌ password
  - ❌ 123456
  - ❌ short

### Admin Passwords
- **Minimum**: 12 characters
- **Requirements**:
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character
- **Change**: Every 30 days
- **Examples**:
  - ✅ Admin@Secure2024
  - ✅ Adm!nP@ss123
  - ✅ SecureAdmin#2024

### Database Passwords
- **Minimum**: 16 characters
- **Requirements**:
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character
- **Change**: Every 6 months
- **Store**: In password manager (1Password, LastPass)

---

## Storing Secrets Safely

### Local Development
```bash
# Option 1: .env file (DO NOT COMMIT)
echo ".env" >> .gitignore

# Option 2: Password Manager
# Use 1Password, LastPass, or Bitwarden

# Option 3: Environment variables
export JWT_SECRET="<secret>"
npm start
```

### Production Deployment

| Method | Security | Cost | Ease |
|--------|----------|------|------|
| Environment Variables | ⭐⭐⭐⭐ | $0 | Medium |
| AWS Secrets Manager | ⭐⭐⭐⭐⭐ | $$$ | Medium |
| HashiCorp Vault | ⭐⭐⭐⭐⭐ | $$ | Hard |
| Azure Key Vault | ⭐⭐⭐⭐⭐ | $$ | Medium |
| Encrypted .env | ⭐⭐⭐ | $0 | Hard |

### AWS Secrets Manager Example
```bash
# Store secret
aws secretsmanager create-secret \
  --name restoproject/jwt \
  --secret-string "your-secret-here"

# Retrieve secret
aws secretsmanager get-secret-value \
  --secret-id restoproject/jwt
```

---

## Security Best Practices

### DO ✅
- [ ] Use environment variables
- [ ] Use strong, random secrets
- [ ] Rotate secrets regularly
- [ ] Use password managers
- [ ] Enable 2FA for admin accounts
- [ ] Log secret access (rotation only)
- [ ] Use HTTPS everywhere
- [ ] Secure backups with encryption
- [ ] Document rotation dates
- [ ] Train team on security

### DON'T ❌
- [ ] Commit secrets to git
- [ ] Share via email/Slack
- [ ] Use weak passwords
- [ ] Reuse secrets
- [ ] Hardcode in source code
- [ ] Log secrets in console
- [ ] Use HTTP for auth
- [ ] Skip backups
- [ ] Forget to rotate
- [ ] Skip security training

---

## Secret Leak Response

### If Secret Is Compromised

**Immediately (0-5 minutes)**
1. Stop application
2. Generate new secret
3. Document time of leak

**Short Term (5-30 minutes)**
1. Revoke old secret
2. Update application
3. Redeploy
4. Monitor for misuse

**Investigation (1-24 hours)**
1. Analyze logs
2. Check for unauthorized access
3. Review git history
4. Identify leak source

**Prevention (24+ hours)**
1. Update access controls
2. Add secret scanning
3. Train team
4. Document incident

### Tools to Prevent Leaks
```bash
# Check git history for secrets
npm install -g truffleHog
truffleHog filesystem .

# Git hook to prevent commits
npm install husky pre-commit
husky install
cat > .husky/pre-commit << 'EOF'
(git diff --cached -S"secret" && echo "ERROR: Possible secret in commit") || true
EOF

# Package scanning
npm audit
npm audit fix
```

---

## Audit Trail

### Track Secret Changes
```
Date         | Secret         | Old Duration | New Duration | Rotated By | Reason
-------------|----------------|--------------|--------------|------------|--------
2024-02-17   | JWT_SECRET     | Used once    | 90 days      | DevOps     | Deployment
2024-05-17   | JWT_SECRET     | 90 days      | 90 days      | DevOps     | Scheduled
2024-08-17   | JWT_SECRET     | 90 days      | 90 days      | DevOps     | Scheduled
2024-11-17   | JWT_SECRET     | 90 days      | 90 days      | DevOps     | Scheduled
```

---

## Emergency Access

### Master Password (Stored Securely)
- **Location**: Vault (physical safe or secure storage)
- **Access**: CEO + CTO only
- **Change**: Quarterly
- **Last Rotated**: Feb 17, 2024

### Emergency Contact
- **Security Lead**: [Name]
- **Phone**: [Number]
- **Email**: security@restoproject.com

### Contingency Plan
1. Generate master secret
2. Store in secure location
3. Two-person rule (both needed)
4. Document retrieval process
5. Test quarterly

---

## Compliance

### Standards Met
- ✅ OWASP Top 10
- ✅ CWE Top 25
- ✅ NIST Cybersecurity Framework
- ✅ ISO 27001 (Partial)

### Audit Trail
- All secret deployments logged
- 90-day rotation compliance
- No secrets in git history
- Encryption at rest and transit

---

## Questions & Support

**For security questions, contact**: security@restoproject.com  
**Response Time**: 24 hours  
**Escalation**: CISO or VP Engineering

---

**Last Updated**: February 17, 2026  
**Version**: 1.0  
**Classification**: Internal Use Only
