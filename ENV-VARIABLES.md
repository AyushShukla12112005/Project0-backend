# Environment Variables Guide

## Local Development (.env file)

Create a `.env` file in the `backend` directory:

```env
# Environment
NODE_ENV=development

# Server
PORT=5000

# Database (Local MongoDB)
MONGODB_URI=mongodb://localhost:27017/bugtracker

# Security
JWT_SECRET=change-this-to-a-secure-random-string-in-production

# Email Configuration (Optional)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
```

## Production (Vercel Environment Variables)

Set these in Vercel Dashboard → Settings → Environment Variables:

### Required Variables

#### NODE_ENV
```
NODE_ENV=production
```
- **Purpose**: Tells the app it's running in production
- **Required**: Yes
- **Value**: `production`

#### JWT_SECRET
```
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```
- **Purpose**: Signs and verifies JWT tokens for authentication
- **Required**: Yes
- **Minimum Length**: 32 characters
- **Example**: `abcdefghijklmnopqrstuvwxyz123456789012`
- **Generate**: Use a password generator or run:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

#### MONGODB_URI
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bugtracker?retryWrites=true&w=majority
```
- **Purpose**: Connects to MongoDB Atlas database
- **Required**: Yes
- **Format**: MongoDB Atlas connection string
- **Get it from**: MongoDB Atlas → Clusters → Connect → Connect your application

**Important Notes:**
- Replace `username` with your MongoDB Atlas username
- Replace `password` with your MongoDB Atlas password
- Replace `cluster` with your actual cluster name
- If password has special characters, URL-encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`

### Optional Variables (Email Features)

#### EMAIL_HOST
```
EMAIL_HOST=smtp.ethereal.email
```
- **Purpose**: SMTP server for sending emails
- **Required**: No (only for password reset feature)
- **Default**: smtp.ethereal.email (for testing)

#### EMAIL_PORT
```
EMAIL_PORT=587
```
- **Purpose**: SMTP server port
- **Required**: No
- **Default**: 587

#### EMAIL_USER
```
EMAIL_USER=your-email@ethereal.email
```
- **Purpose**: SMTP authentication username
- **Required**: No

#### EMAIL_PASS
```
EMAIL_PASS=your-password
```
- **Purpose**: SMTP authentication password
- **Required**: No

## MongoDB Atlas Setup

### 1. Create Cluster
1. Go to https://mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Choose a region close to your users

### 2. Create Database User
1. Go to Database Access
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `bugtracker-user` (or your choice)
5. Password: Generate a secure password
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 3. Configure Network Access
1. Go to Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. IP Address: `0.0.0.0/0`
5. Click "Confirm"

**Why `0.0.0.0/0`?**
- Vercel serverless functions use dynamic IPs
- This allows connections from any IP
- Your database is still protected by username/password

### 4. Get Connection String
1. Go to Clusters
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `bugtracker`

Example:
```
mongodb+srv://bugtracker-user:MySecurePass123@cluster0.abc123.mongodb.net/bugtracker?retryWrites=true&w=majority
```

## Setting Environment Variables in Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Select your project
3. Go to Settings → Environment Variables
4. For each variable:
   - **Key**: Variable name (e.g., `JWT_SECRET`)
   - **Value**: Variable value
   - **Environment**: Select "Production" (and optionally Preview/Development)
   - Click "Save"

### Method 2: Vercel CLI

```bash
vercel env add JWT_SECRET production
# Enter value when prompted

vercel env add MONGODB_URI production
# Enter value when prompted

vercel env add NODE_ENV production
# Enter: production
```

## Verifying Environment Variables

### After Setting Variables:

1. **Redeploy your application**
   - Vercel Dashboard → Deployments → Redeploy

2. **Test the health endpoint**
   ```bash
   curl https://your-backend.vercel.app/api/health
   ```

3. **Check the response**
   ```json
   {
     "ok": true,
     "env": {
       "hasJwtSecret": true,    // ← Should be true
       "hasMongoUri": true,     // ← Should be true
       "nodeEnv": "production"  // ← Should be "production"
     }
   }
   ```

If any value is `false`, that environment variable is not set correctly.

## Common Issues

### "JWT_SECRET is not configured"
**Fix**: Add `JWT_SECRET` to Vercel environment variables

### "MONGODB_URI is not configured"
**Fix**: Add `MONGODB_URI` to Vercel environment variables

### "MongoDB connection failed"
**Possible causes:**
1. Wrong connection string format
2. Wrong username/password
3. Network access not configured (missing `0.0.0.0/0`)
4. Database user doesn't have permissions

### "Authentication failed"
**Fix**: Check username and password in connection string

## Security Best Practices

### ✅ DO:
- Use strong, random JWT_SECRET (min 32 characters)
- Use MongoDB Atlas for production
- Keep `.env` file in `.gitignore`
- Use different secrets for development and production
- Rotate secrets periodically

### ❌ DON'T:
- Commit `.env` file to Git
- Use simple/short JWT secrets
- Share secrets publicly
- Use same secrets across environments
- Use default/example secrets in production

## Checklist

Before deploying:

- [ ] `.env` file created for local development
- [ ] `.env` added to `.gitignore`
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] Network access allows `0.0.0.0/0`
- [ ] Connection string copied
- [ ] JWT_SECRET generated (min 32 chars)
- [ ] All variables added to Vercel
- [ ] Application redeployed
- [ ] Health endpoint tested

## Quick Reference

| Variable | Local Dev | Production | Required |
|----------|-----------|------------|----------|
| NODE_ENV | development | production | Yes |
| PORT | 5000 | (auto) | No |
| MONGODB_URI | localhost | Atlas | Yes |
| JWT_SECRET | any | strong | Yes |
| EMAIL_* | optional | optional | No |

---

**Remember**: After adding or changing environment variables in Vercel, you must redeploy for changes to take effect!
