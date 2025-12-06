# Quick Reference Guide

## Using AuthContext in Your Components

### Before (Prop Drilling)
```jsx
function ParentComponent({ onLogout }) {
  return <ChildComponent onLogout={onLogout} />;
}

function ChildComponent({ onLogout }) {
  return <button onClick={onLogout}>Logout</button>;
}
```

### After (AuthContext)
```jsx
function ChildComponent() {
  const { logout } = useAuth();
  return <button onClick={logout}>Logout</button>;
}
```

## Using Utilities

### Token Management
```jsx
import { saveToken, clearToken, getStoredAuth, isAuthenticated } from '../utils/auth';

// Save token after login
saveToken(tokenFromServer);

// Check if logged in
if (isAuthenticated()) {
  // Show dashboard
}

// Get current auth for API calls
const { token, tokenType } = getStoredAuth();

// Logout
clearToken();
```

### Caching
```jsx
import { 
  getCachedCourses, 
  setCachedCourses, 
  clearAllCaches 
} from '../utils/storage';

// Get from cache
const courses = getCachedCourses();

// Save to cache
setCachedCourses(newCoursesList);

// Clear all caches
clearAllCaches();
```

### API Response Handling
```jsx
import { 
  normalizeResponse, 
  extractToken, 
  getErrorMessage 
} from '../utils/apiHelpers';

// Normalize any API response to array
const courses = normalizeResponse(response);

// Extract token from login response
const token = extractToken(loginResponse);

// Get user-friendly error message
try {
  await fetchCourses();
} catch (error) {
  const message = getErrorMessage(error);
  showAlert(message);
}
```

### Error Handling
```jsx
import { logError, getUserErrorMessage } from '../utils/errorHandler';

try {
  // some operation
} catch (error) {
  logError('OperationName', error, { 
    userId: user.id,
    timestamp: new Date() 
  });
  
  const userMessage = getUserErrorMessage(error);
  setMessage(userMessage);
}
```

### UI Components
```jsx
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';

// Loading spinner
<Spinner size="md" text="Loading..." />

// Fullscreen spinner
<Spinner fullscreen={true} size="lg" text="Processing..." />

// Alert message
<Alert 
  type="success" 
  message="Account updated!" 
  onDismiss={() => setMessage(null)} 
/>

// Error alert
<Alert 
  type="error" 
  message="Failed to save changes" 
/>
```

## File Organization

### Add New Utility Function
1. Determine which utility file it belongs to
2. Add function with JSDoc comments
3. Export from that file
4. Use in components/pages

### Add New Page
1. Create file in `src/pages/`
2. Import `useAuth()` if authentication needed
3. Use `useNavigate()` for routing
4. Use `Alert` component for messages
5. Add route to `router.jsx`

### Add New Component
1. Create file in `src/components/`
2. Import utilities as needed
3. Keep logic minimal (mostly presentation)
4. Extract complex logic to hooks or utilities

## Common Patterns

### Protected Route (Coming Soon)
```jsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### Using Alert in Component
```jsx
const [message, setMessage] = useState(null);

return (
  <>
    <Alert 
      type={message?.type} 
      message={message?.text}
      onDismiss={() => setMessage(null)}
    />
    {/* Rest of component */}
  </>
);
```

### API Call with Error Handling
```jsx
import { getUserErrorMessage } from '../utils/errorHandler';

const handleSubmit = async (data) => {
  try {
    setLoading(true);
    const response = await updateAccount(data);
    setMessage({ type: 'success', text: 'Saved!' });
  } catch (error) {
    const message = getUserErrorMessage(error);
    setMessage({ type: 'error', text: message });
  } finally {
    setLoading(false);
  }
};
```

### Using AuthContext for Protected Sections
```jsx
const { isAuth, user } = useAuth();

return (
  <>
    {isAuth ? (
      <DashboardContent user={user} />
    ) : (
      <LoginPrompt />
    )}
  </>
);
```

## Debugging Tips

### Check Auth State
```javascript
// In browser console
localStorage.getItem('authToken')
localStorage.getItem('authTokenType')
localStorage.getItem('userData')
```

### View Cached Data
```javascript
// Check courses cache
JSON.parse(localStorage.getItem('courses_cache_v1'))

// Check lectures cache
JSON.parse(localStorage.getItem('lectures_cache_1'))
```

### Clear Everything (Debug)
```javascript
// Clear auth
localStorage.removeItem('authToken')
localStorage.removeItem('authTokenType')

// Clear all caches
Object.keys(localStorage).forEach(key => {
  if (key.includes('cache')) localStorage.removeItem(key)
})

// Reload
location.reload()
```

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "useAuth must be used within AuthProvider" | Using hook outside provider | Ensure App.jsx wraps children with AuthProvider |
| 401 errors on API calls | Token not sent | Check localStorage for `authToken` |
| Logout doesn't work | Old state lingering | Verify `clearAuthToken()` is called |
| Spinner not showing | Props incorrect | Check size: 'sm' \| 'md' \| 'lg' |
| Alert not appearing | Type not recognized | Use: 'success' \| 'error' \| 'warning' \| 'info' |

## Best Practices

1. **Always use AuthContext** instead of manual localStorage
2. **Always use utility functions** instead of duplicating logic
3. **Always use Alert/Spinner components** for consistency
4. **Always handle errors** with getUserErrorMessage()
5. **Always normalize API responses** before using
6. **Keep components small** and focused on UI only
7. **Extract logic to hooks/utils** when component gets too big

---

**For Questions or Issues**: Check REFACTORING_SUMMARY.md for architecture overview
