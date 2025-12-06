# Migration Path - What to Update Next

## Phase 1: Complete (✅)
- [x] Created utility layer (auth.js, storage.js, apiHelpers.js, errorHandler.js)
- [x] Created AuthContext
- [x] Created UI components (Spinner, Alert)
- [x] Updated api.js
- [x] Updated App.jsx
- [x] Updated Login.jsx

## Phase 2: Critical (Next 1-2 hours)

### 1. Update `src/pages/SignUp.jsx`
**What to do:**
- Import `useAuth` instead of `setAuthToken`
- Import `extractToken` from apiHelpers
- Import `useNavigate` from react-router-dom
- Import `Alert` component
- Replace signup logic to use `login()` from context
- Remove prop drilling

**Before:**
```jsx
import { signupUser, setAuthToken } from '../api';

const SignUp = ({ goToLogin }) => {
  const onSubmit = async (values, formik) => {
    const res = await signupUser(values);
    setAuthToken(res.data.token);
    // ...
  }
}
```

**After:**
```jsx
import { useAuth } from '../contexts/AuthContext';
import { extractToken } from '../utils/apiHelpers';

const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const onSubmit = async (values, formik) => {
    const res = await signupUser(values);
    const token = extractToken(res);
    if (token) login(token);
    navigate('/dashboard');
  }
}
```

### 2. Update `src/pages/Dashboard.jsx`
**What to do:**
- Remove any manual state management
- Add `useAuth()` if it checks auth
- Use `Alert` for messages instead of inline state
- Keep it simple - it's just a landing page

### 3. Update `src/pages/Courses.jsx`
**What to do:**
- Keep `useCourses` hook for now
- Update it to use storage utilities instead of direct localStorage
- Replace inline message state with Alert component
- Import `Spinner` for loading states
- Keep component focused on UI only

**Changes in hook:**
```jsx
import { getCachedCourses, setCachedCourses, clearAllLectureCaches } from '../utils/storage';

// Instead of:
localStorage.getItem('courses_cache_v1')

// Use:
getCachedCourses()

// Instead of:
localStorage.setItem('courses_cache_v1', JSON.stringify(items))

// Use:
setCachedCourses(items)
```

### 4. Update `src/pages/AccountManagement.jsx`
**What to do:**
- Import `useAuth()` to get user from context
- Update `useAccountManager` hook to use utilities
- Replace error messages with `getUserErrorMessage()`
- Use `Alert` component for feedback
- Use `Spinner` for loading states

## Phase 3: Important (Next 2-4 hours)

### 5. Refactor `src/hooks/useCourses.js`
**What needs change:**
- Remove API logic - that belongs in api.js
- Keep only state management
- Use storage utilities instead of direct localStorage
- Simplify error handling

**Current problems:**
- 126 lines - too large
- Mixes API calls with state
- Duplicates normalization logic

**Better structure:**
```jsx
export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchCourses();
      const items = normalizeResponse(res); // Use utility
      setCachedCourses(items); // Use utility
      setCourses(items);
    } catch (err) {
      setError(getUserErrorMessage(err)); // Use utility
    } finally {
      setLoading(false);
    }
  }, []);

  return { courses, loading, error, loadCourses };
};
```

### 6. Refactor `src/hooks/useAccountManager.js`
**What needs change:**
- Same as useCourses - separate concerns
- Use AuthContext to get/set user
- Use storage utilities
- Use error utilities

### 7. Update Component Files

#### `src/components/courses/CourseModal.jsx`
- Use `Spinner` while creating
- Use `Alert` for errors
- Use `normalizeResponse` if handling responses

#### `src/components/courses/AddLectureModal.jsx`
- Use `Spinner` for upload progress
- Use `Alert` for errors
- Remove error/message state - use parent's

#### `src/components/forms/AccountUpdateForm.jsx`
- Keep as-is (mostly presentation)
- Parent page handles messages

## Phase 4: Polish (Nice to have)

### Add Missing Components
- [ ] `ProtectedRoute.jsx` - wrapper for auth pages
- [ ] `Toast` context - for better notifications
- [ ] `ErrorBoundary.jsx` - catch component crashes

### Improve Error Handling
- [ ] Add error boundary to router
- [ ] Add network error detection
- [ ] Add offline mode detection

### Code Quality
- [ ] Convert all Arabic comments to English
- [ ] Add JSDoc to all functions
- [ ] Add PropTypes to all components
- [ ] Add unit tests for utilities

## Testing the Changes

### Before You Deploy:

1. **Test Login Flow**
   ```
   - Go to login page
   - Enter credentials
   - Should navigate to dashboard
   - Token should be in localStorage
   - Logout button should appear
   ```

2. **Test Logout**
   ```
   - Click logout button
   - Should return to login
   - localStorage should be empty
   - Can't access protected routes
   ```

3. **Test Error Handling**
   ```
   - Try invalid credentials
   - Should show error message
   - Try while offline
   - Should handle gracefully
   ```

4. **Test Caching**
   ```
   - Load courses
   - Check localStorage
   - Should have courses_cache_v1
   - Clear cache, should reflect in UI
   ```

5. **Test Dark Mode**
   ```
   - Toggle theme
   - Should persist in localStorage
   - All components should work in both modes
   ```

## File Checklist - What Uses What

### ✅ Already Updated
- [x] App.jsx - uses AuthProvider, storage.js
- [x] Login.jsx - uses AuthContext, extractToken()
- [x] api.js - uses auth.js, apiHelpers.js

### ⏳ Need Update (Priority)
- [ ] SignUp.jsx - use AuthContext, extractToken()
- [ ] Courses.jsx - use storage.js utilities, Alert, Spinner
- [ ] AccountManagement.jsx - use storage.js, errorHandler.js, Alert

### ⏳ Need Update (Hooks)
- [ ] useCourses.js - simplify, use storage utilities
- [ ] useAccountManager.js - simplify, use storage utilities

### ⏳ Need Update (Components)
- [ ] CourseModal.jsx - use Spinner, Alert
- [ ] AddLectureModal.jsx - use Spinner, Alert
- [ ] CoursesList.jsx - no changes needed
- [ ] CourseCard.jsx - no changes needed
- [ ] FloatingButton.jsx - no changes needed
- [ ] InputField.jsx - no changes needed

### ✅ No Changes Needed
- [x] Dashboard.jsx - simple enough
- [x] router.jsx - already complete
- [x] constants/ - validation.js, values.js
- [x] components/ui/ - new components

## Git Commit Guide

```bash
# Phase 1 commits (done)
git commit -m "feat: add utility layer (auth, storage, apiHelpers, errorHandler)"
git commit -m "feat: add AuthContext for global state management"
git commit -m "feat: add UI components (Spinner, Alert)"
git commit -m "refactor: update api.js to use utilities"
git commit -m "refactor: update App.jsx to use AuthContext"
git commit -m "refactor: update Login.jsx to use AuthContext"

# Phase 2 commits (next)
git commit -m "refactor: update SignUp.jsx to use AuthContext"
git commit -m "refactor: update Courses.jsx to use utilities"
git commit -m "refactor: update AccountManagement.jsx to use utilities"

# Phase 3 commits (after)
git commit -m "refactor: simplify useCourses hook"
git commit -m "refactor: simplify useAccountManager hook"
git commit -m "refactor: update course components to use utilities"

# Phase 4 commits (polish)
git commit -m "feat: add ProtectedRoute component"
git commit -m "feat: add Toast notification system"
git commit -m "chore: standardize comments to English"
git commit -m "docs: add JSDoc comments to all functions"
```

## Estimated Effort

- Phase 1: ✅ Complete (already done)
- Phase 2: ~2 hours (straightforward updates)
- Phase 3: ~3 hours (refactoring hooks)
- Phase 4: ~2 hours (nice to have)

**Total remaining**: ~7 hours for full cleanup

---

**Remember**: 
1. Test after each phase
2. Commit frequently 
3. Use this guide as reference
4. Check QUICK_REFERENCE.md for code examples
