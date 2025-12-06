# GitHub-Style CSS System - Complete Guide

## Overview

Your project now has a **unified, GitHub-inspired CSS system** using Tailwind CSS with CSS custom properties (variables) for theming.

---

## 🎨 Color System

### CSS Variables

All colors are defined as CSS custom properties that automatically switch between light and dark modes:

```css
/* Light Mode (default) */
--color-bg-primary      /* #ffffff - Main background */
--color-bg-secondary    /* #f6f8fa - Secondary background */
--color-bg-tertiary     /* #eaeef2 - Tertiary background */

--color-text-primary    /* #24292f - Main text color */
--color-text-secondary  /* #57606a - Secondary text */
--color-text-muted      /* #8c959f - Muted text */

--color-border          /* #d0d7de - Border color */
--color-border-muted    /* #e5e7eb - Muted border */

--color-blue            /* #0969da - Primary blue */
--color-green           /* #1a7f37 - Success green */
--color-red             /* #d1242f - Error red */
--color-yellow          /* #9e6a03 - Warning yellow */
--color-purple          /* #6f42c1 - Purple accent */
```

### Dark Mode

Simply add `data-theme="dark"` to the HTML root:

```jsx
<html data-theme="dark">
```

---

## 🔘 Buttons

### Basic Button Styles

```jsx
/* Primary (Blue) */
<button className="btn btn-primary">Click Me</button>

/* Secondary (Gray) */
<button className="btn btn-secondary">Secondary</button>

/* Danger (Red) */
<button className="btn btn-danger">Delete</button>

/* Success (Green) */
<button className="btn btn-success">Save</button>

/* Ghost (Outline) */
<button className="btn btn-ghost">Outline</button>
```

### Button Sizes

```jsx
/* Small */
<button className="btn btn-sm btn-primary">Small</button>

/* Normal (default) */
<button className="btn btn-primary">Normal</button>

/* Large */
<button className="btn btn-lg btn-primary">Large</button>

/* Full Width */
<button className="btn btn-full btn-primary">Full Width</button>
```

### Button States

```jsx
/* Disabled */
<button className="btn btn-primary" disabled>Disabled</button>

/* With Icon */
<button className="btn btn-primary">
  🔒 Login
</button>
```

---

## 📝 Form Controls

### Text Inputs

```jsx
<input
  type="text"
  placeholder="Enter text"
  className="w-full"
/>

<input
  type="email"
  placeholder="your@email.com"
  className="w-full"
/>

<input
  type="password"
  placeholder="••••••••"
  className="w-full"
/>

<input
  type="number"
  placeholder="0"
  className="w-full"
/>
```

### Textarea

```jsx
<textarea
  placeholder="Enter your message"
  rows="5"
  className="w-full"
/>
```

### Select

```jsx
<select className="w-full">
  <option>Choose an option</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Checkbox & Radio

```jsx
<label className="flex items-center gap-2">
  <input type="checkbox" />
  <span>Accept terms</span>
</label>

<label className="flex items-center gap-2">
  <input type="radio" name="option" />
  <span>Option 1</span>
</label>
```

### File Input

```jsx
<input type="file" accept="image/*" />
```

---

## 🎴 Cards

### Basic Card

```jsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```

### Card with Header & Footer

```jsx
<div className="card">
  <div className="card-header">
    <h3>Card Title</h3>
  </div>
  <div>Card content</div>
  <div className="card-footer">
    <button className="btn btn-primary">Action</button>
  </div>
</div>
```

---

## ⚠️ Alerts

### Alert Types

```jsx
/* Success Alert */
<div className="alert alert-success">
  <span className="alert-icon">✓</span>
  <div className="alert-content">
    <div className="alert-title">Success!</div>
    <div className="alert-description">Operation completed</div>
  </div>
</div>

/* Error Alert */
<div className="alert alert-error">
  <span className="alert-icon">✕</span>
  <div className="alert-content">
    <div className="alert-title">Error</div>
    <div className="alert-description">Something went wrong</div>
  </div>
</div>

/* Warning Alert */
<div className="alert alert-warning">
  <span className="alert-icon">⚠</span>
  <div className="alert-content">
    <div className="alert-title">Warning</div>
    <div className="alert-description">Please review</div>
  </div>
</div>

/* Info Alert */
<div className="alert alert-info">
  <span className="alert-icon">ℹ</span>
  <div className="alert-content">
    <div className="alert-title">Info</div>
    <div className="alert-description">FYI: Something happened</div>
  </div>
</div>
```

---

## 🏷️ Badges

### Badge Types

```jsx
/* Primary */
<span className="badge badge-primary">Primary</span>

/* Success */
<span className="badge badge-success">Success</span>

/* Danger */
<span className="badge badge-danger">Danger</span>

/* Warning */
<span className="badge badge-warning">Warning</span>

/* Secondary */
<span className="badge badge-secondary">Secondary</span>
```

### Practical Examples

```jsx
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-danger">Failed</span>
<span className="badge badge-info">New</span>
```

---

## 📊 Tables

```jsx
<table>
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
      <th>Column 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
      <td>Data 3</td>
    </tr>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
      <td>Data 3</td>
    </tr>
  </tbody>
</table>
```

---

## 🪟 Modals

### Modal Structure

```jsx
<div className="modal-overlay">
  <div className="modal">
    <div className="modal-header">
      <h2>Modal Title</h2>
      <button className="btn btn-sm btn-ghost">✕</button>
    </div>
    
    <div className="modal-body">
      <p>Modal content goes here</p>
    </div>
    
    <div className="modal-footer">
      <button className="btn btn-ghost">Cancel</button>
      <button className="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

---

## 📱 Typography

### Headings

```jsx
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>
```

### Text Utilities

```jsx
/* Muted text */
<p className="text-muted">This text is muted</p>

/* Secondary text */
<p className="text-secondary">Secondary text</p>

/* Error text */
<p className="text-error">Error message</p>

/* Success text */
<p className="text-success">Success message</p>

/* Warning text */
<p className="text-warning">Warning message</p>

/* Info text */
<p className="text-info">Info message</p>
```

### Code Blocks

```jsx
/* Inline code */
<code>const x = 5;</code>

/* Code block */
<pre><code>
function hello() {
  console.log("Hello");
}
</code></pre>
```

---

## 🗺️ Layout

### Container

```jsx
<div className="container">
  <div className="container-max">
    {/* Your content with max-width 7xl */}
  </div>
</div>
```

### Fluid Container

```jsx
<div className="container-fluid">
  {/* Full width with padding */}
</div>
```

### Divider

```jsx
<div className="divider"></div>
```

---

## 🎯 Spacing

### Gap Utilities

```jsx
<div className="flex gap-xs">Small gap (0.5rem)</div>
<div className="flex gap-sm">Small gap (0.75rem)</div>
<div className="flex gap-md">Medium gap (1rem)</div>
<div className="flex gap-lg">Large gap (1.5rem)</div>
<div className="flex gap-xl">Extra large (2rem)</div>
```

---

## 🔄 Responsive

### Hide/Show Helpers

```jsx
/* Show only on small screens and up */
<div className="hidden-sm">Hidden on small screens</div>

/* Show only on medium screens and up */
<div className="hidden-md">Hidden on medium screens</div>

/* Show only on large screens and up */
<div className="hidden-lg">Hidden on large screens</div>
```

---

## ✨ Animations

### Available Animations

```jsx
/* Fade in */
<div className="animate-fadeIn">Fades in</div>

/* Slide down */
<div className="animate-slideDown">Slides down</div>

/* Pulse (loading) */
<div className="animate-pulse">Pulsing element</div>
```

---

## 🌓 Dark Mode Implementation

### In React Component

```jsx
const [theme, setTheme] = useState('light');

useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]);

const toggleTheme = () => {
  setTheme(t => t === 'light' ? 'dark' : 'light');
};

return (
  <>
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  </>
);
```

---

## 📋 Complete Example Page

```jsx
import { useState } from 'react';

export default function DemoPage() {
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-[var(--color-bg-primary)]">
      {/* Header */}
      <header>
        <div className="container-fluid container-max flex items-center justify-between h-16">
          <h1 className="text-2xl">📚 EduHub</h1>
          <nav className="flex items-center gap-2">
            <a href="/" className="btn btn-ghost">Home</a>
            <a href="/courses" className="btn btn-ghost">Courses</a>
            <button className="btn btn-secondary">Login</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-fluid container-max py-8">
        {/* Alert Example */}
        {message && (
          <div className="alert alert-success mb-6">
            <span className="alert-icon">✓</span>
            <div className="alert-content">
              <div className="alert-title">Success</div>
              <div className="alert-description">{message}</div>
            </div>
          </div>
        )}

        {/* Card Example */}
        <div className="card mb-6">
          <div className="card-header">
            <h2>Welcome to EduHub</h2>
          </div>
          <p>This is a professional GitHub-style page built with unified CSS.</p>
          
          <div className="card-footer">
            <button 
              className="btn btn-primary"
              onClick={() => setMessage('Action completed!')}
            >
              Click Me
            </button>
            <button 
              className="btn btn-secondary ml-2"
              onClick={() => setShowModal(true)}
            >
              Open Modal
            </button>
          </div>
        </div>

        {/* Modal Example */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Modal Example</h2>
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <p>This is a modal window with your unified CSS styling.</p>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table Example */}
        <div className="card mb-6">
          <div className="card-header">
            <h3>Sample Data</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Course 1</td>
                <td><span className="badge badge-success">Active</span></td>
                <td><button className="btn btn-sm btn-primary">Edit</button></td>
              </tr>
              <tr>
                <td>Course 2</td>
                <td><span className="badge badge-warning">Pending</span></td>
                <td><button className="btn btn-sm btn-primary">Edit</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
```

---

## 🎨 Customization

To customize the colors, edit the CSS variables in `src/index.css`:

```css
:root {
  /* Your custom light mode colors */
  --color-blue: #your-color;
}

[data-theme="dark"] {
  /* Your custom dark mode colors */
  --color-blue: #your-color;
}
```

---

## ✅ Checklist for Implementation

- [ ] Update all pages to use button classes
- [ ] Replace inline styles with CSS classes
- [ ] Use card classes for containers
- [ ] Use alert classes for messages
- [ ] Use badge classes for status indicators
- [ ] Ensure dark mode works everywhere
- [ ] Test on mobile devices
- [ ] Verify accessibility (contrast, focus states)

---

## 📚 CSS Classes Reference

| Class | Purpose |
|-------|---------|
| `.btn` | Base button |
| `.btn-primary` | Primary blue button |
| `.btn-secondary` | Secondary gray button |
| `.btn-danger` | Red danger button |
| `.btn-success` | Green success button |
| `.btn-ghost` | Outline button |
| `.card` | Card container |
| `.alert` | Alert base |
| `.alert-success` | Green success alert |
| `.alert-error` | Red error alert |
| `.alert-warning` | Yellow warning alert |
| `.alert-info` | Blue info alert |
| `.badge` | Badge base |
| `.badge-primary` | Primary badge |
| `.badge-success` | Success badge |
| `.badge-danger` | Danger badge |
| `.badge-warning` | Warning badge |
| `.modal-overlay` | Modal background |
| `.modal` | Modal window |
| `.container` | Max width container |
| `.container-fluid` | Padded container |

---

**All components automatically support light and dark mode!** 🌓
