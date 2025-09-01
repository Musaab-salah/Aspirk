# Admin Login System

## Overview
The admin dashboard now includes a secure login system that requires username and password authentication before accessing the admin panel.

## Features

### 🔐 Authentication
- **Login Form**: Clean, Arabic-styled login interface
- **Password Visibility Toggle**: Show/hide password functionality
- **Session Persistence**: Login state is maintained using localStorage
- **Logout Functionality**: Secure logout with session cleanup

### 🎨 User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Arabic Language Support**: Full RTL support with Arabic text
- **Loading States**: Visual feedback during authentication
- **Error Handling**: Clear error messages for failed login attempts

### 🔒 Security
- **API-based Authentication**: Server-side credential validation
- **Session Management**: Automatic session restoration on page reload
- **Secure Logout**: Complete session cleanup on logout

## Default Credentials

**Username:** `admin`  
**Password:** `admin123`

> ⚠️ **Important**: These are demo credentials. In production, implement proper password hashing and secure credential storage.

## File Structure

```
app/
├── admin/
│   ├── page.tsx              # Main admin dashboard with auth logic
│   └── layout.tsx            # Admin layout with user menu
├── api/
│   └── admin/
│       └── auth/
│           └── route.ts      # Authentication API endpoint
components/
└── AdminLogin.tsx            # Login form component
```

## How It Works

1. **Initial Access**: When visiting `/admin`, users see the login form
2. **Authentication**: Users enter credentials which are validated via API
3. **Session Storage**: Successful login stores authentication state in localStorage
4. **Dashboard Access**: Authenticated users can access the full admin dashboard
5. **Session Persistence**: Login state persists across browser sessions
6. **Logout**: Users can logout, which clears session data and returns to login

## API Endpoint

### POST `/api/admin/auth`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

**Error Response:**
```json
{
  "error": "اسم المستخدم أو كلمة المرور غير صحيحة"
}
```

## Customization

### Changing Default Credentials
Update the credentials in `app/api/admin/auth/route.ts`:

```typescript
const ADMIN_CREDENTIALS = {
  username: 'your_username',
  password: 'your_password'
}
```

### Styling
The login form uses Tailwind CSS classes and can be customized by modifying `components/AdminLogin.tsx`.

### Adding More Admin Users
For multiple admin users, consider implementing a database with user management features.

## Security Considerations

1. **Password Hashing**: Implement bcrypt or similar for password storage
2. **JWT Tokens**: Use JWT for more secure session management
3. **Rate Limiting**: Add rate limiting to prevent brute force attacks
4. **HTTPS**: Ensure HTTPS in production
5. **Database Storage**: Store credentials in a secure database instead of hardcoded values

## Browser Compatibility

- Modern browsers with localStorage support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)


