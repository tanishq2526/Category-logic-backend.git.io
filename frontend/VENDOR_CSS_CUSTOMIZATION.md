# Vendor Panel CSS - Customization Guide

## How to Customize the Design System

### 1. Changing the Color Palette

Edit the CSS variables at the top of `vendor.css`:

```css
:root {
  /* Change these colors to customize the entire theme */
  --primary-bg: #0f172a;      /* Main background */
  --secondary-bg: #111827;    /* Secondary background */
  --tertiary-bg: #0b1120;     /* Tertiary background */
  
  --text-primary: #f1f5f9;    /* Main text color */
  --text-secondary: #cbd5e1;  /* Secondary text */
  --text-tertiary: #94a3b8;   /* Tertiary text */
  --text-muted: #475569;      /* Muted text */
  
  /* Status/Action colors */
  --success: #34d399;         /* Green for success */
  --warning: #fbbf24;         /* Amber for warnings */
  --error: #f87171;           /* Red for errors */
  --info: #60a5fa;            /* Blue for info */
  --purple: #a78bfa;          /* Purple accent */
}
```

**Example: Change to light theme**
```css
:root {
  --primary-bg: #ffffff;
  --secondary-bg: #f9fafb;
  --tertiary-bg: #f3f4f6;
  --text-primary: #111827;
  --text-secondary: #374151;
  --text-tertiary: #6b7280;
  --text-muted: #9ca3af;
}
```

### 2. Adjusting Spacing

```css
:root {
  --spacing-xs: 4px;      /* Smallest spacing */
  --spacing-sm: 8px;      /* Small spacing */
  --spacing-md: 12px;     /* Medium spacing */
  --spacing-lg: 16px;     /* Large spacing */
  --spacing-xl: 20px;     /* Extra large spacing */
  --spacing-2xl: 28px;    /* 2x extra large */
  --spacing-3xl: 32px;    /* 3x extra large */
}
```

**Example: Increase all spacing by 1.5x**
```css
:root {
  --spacing-xs: 6px;
  --spacing-sm: 12px;
  --spacing-md: 18px;
  --spacing-lg: 24px;
  --spacing-xl: 30px;
  --spacing-2xl: 42px;
  --spacing-3xl: 48px;
}
```

### 3. Changing Border Radius

```css
:root {
  --radius-sm: 6px;   /* Small radius */
  --radius-md: 10px;  /* Medium radius */
  --radius-lg: 14px;  /* Large radius */
  --radius-xl: 16px;  /* Extra large radius */
}
```

**Example: More rounded corners**
```css
:root {
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
}
```

### 4. Modifying Button Styles

**Change primary button color:**
```css
.btn-primary {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
}
```

**Add different button sizes:**
```css
.btn-lg {
  padding: 12px 20px;
  font-size: 14px;
}

.btn-xl {
  padding: 14px 24px;
  font-size: 15px;
}
```

### 5. Customizing Cards

**Add shadows to cards:**
```css
.card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Add this */
}
```

**Change card hover effect:**
```css
.card:hover {
  background: rgba(255, 255, 255, 0.08);        /* More visible */
  border-color: var(--border-light);
  transform: translateY(-4px);                   /* Move up more */
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);  /* Bigger shadow */
}
```

### 6. Adding New Status Colors

```css
/* Add after existing status colors */
.badge-pending-review {
  background: rgba(168, 85, 247, 0.12);
  color: #a855f7;
}

.badge-pending-review::before {
  background: #a855f7;
}
```

### 7. Adjusting Typography

**Change font size scale:**
```css
.text-sm { font-size: 11px; }    /* was 12px */
.text-base { font-size: 14px; }  /* was 13px */
.text-lg { font-size: 18px; }    /* was 16px */
```

**Change font weights:**
```css
.font-500 { font-weight: 400; }  /* Lighter */
.font-600 { font-weight: 600; }  /* Keep same */
.font-700 { font-weight: 800; }  /* Bolder */
```

### 8. Creating New Stat Card Icons

```css
/* Add new icon colors */
.stat-icon.orange {
  background: rgba(251, 146, 60, 0.2);
  color: #f97316;
}

.stat-icon.pink {
  background: rgba(236, 72, 153, 0.2);
  color: #ec4899;
}

.stat-icon.teal {
  background: rgba(20, 184, 166, 0.2);
  color: #14b8a6;
}
```

### 9. Changing Animation Speeds

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fadeUp 0.3s ease-out;  /* Change 0.3s to faster/slower */
}
```

**Example: Slower animations**
```css
.card {
  animation: fadeUp 0.6s ease-out;  /* Double the duration */
}
```

### 10. Dark/Light Mode Implementation

```css
/* Add at the beginning of vendor.css */
@media (prefers-color-scheme: light) {
  :root {
    --primary-bg: #ffffff;
    --secondary-bg: #f9fafb;
    --text-primary: #111827;
    --text-secondary: #374151;
    /* Update all colors for light mode */
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --primary-bg: #0f172a;
    --secondary-bg: #111827;
    /* Default dark mode */
  }
}
```

### 11. Mobile Optimization

**Adjust spacing on mobile:**
```css
@media (max-width: 640px) {
  :root {
    --spacing-xl: 16px;    /* Reduce from 20px */
    --spacing-lg: 12px;    /* Reduce from 16px */
  }
  
  .vendor-page {
    padding: var(--spacing-lg);  /* Reduce from 3xl */
  }
}
```

### 12. Creating New Components

**Example: New alert component**
```css
.alert {
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  border: 1px solid;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.alert-success {
  background: rgba(52, 211, 153, 0.1);
  border-color: rgba(52, 211, 153, 0.3);
  color: #34d399;
}

.alert-error {
  background: rgba(248, 113, 113, 0.1);
  border-color: rgba(248, 113, 113, 0.3);
  color: #f87171;
}
```

### 13. Customizing Tables

**Add striping:**
```css
.table tbody tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.02);
}
```

**Change header style:**
```css
.table th {
  background: rgba(96, 165, 250, 0.1);  /* Blue tint */
  color: #60a5fa;
  border-bottom: 2px solid var(--border-light);
}
```

### 14. Form Customization

**Add border on focus:**
```css
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid #60a5fa;  /* Blue border */
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15);
}
```

### 15. Custom Gradients

```css
/* Purple gradient */
.gradient-purple {
  background: linear-gradient(135deg, #a855f7, #7c3aed);
}

/* Orange gradient */
.gradient-orange {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

/* Teal gradient */
.gradient-teal {
  background: linear-gradient(135deg, #14b8a6, #0d9488);
}
```

---

## Testing Your Customizations

### 1. Clear Browser Cache
- Press `Ctrl + Shift + Delete` (or `Cmd + Shift + Delete`)
- Clear cache and cookies
- Hard refresh the page

### 2. Check CSS in DevTools
```javascript
// In browser console
getComputedStyle(document.querySelector('.card')).backgroundColor
```

### 3. Test Responsive Design
- Use Chrome DevTools (F12)
- Device Toolbar (Ctrl + Shift + M)
- Test at 320px, 768px, 1024px

### 4. Performance Check
- Look for "Recalculate Style" time
- Should be < 10ms
- Check for paint/layout thrashing

---

## Common Customization Scenarios

### Scenario 1: Corporate Branding
```css
:root {
  --primary-bg: #1a1a2e;
  --text-primary: #e0e0e0;
  --success: #4ecca3;
  --error: #ff6b6b;
  --warning: #ffa502;
  --info: #4ecdc4;
}
```

### Scenario 2: High Contrast (Accessibility)
```css
:root {
  --text-primary: #000000;
  --text-secondary: #333333;
  --border-color: rgba(0, 0, 0, 0.3);
  --success: #008000;
  --error: #ff0000;
  --warning: #ff8c00;
}
```

### Scenario 3: Minimalist Design
```css
:root {
  --spacing-lg: 12px;
  --radius-md: 4px;
  --radius-xl: 6px;
}

.card {
  border: none;
  background: rgba(255, 255, 255, 0.02);
}
```

### Scenario 4: Vibrant Colors
```css
:root {
  --success: #00ff41;
  --error: #ff0080;
  --warning: #ffaa00;
  --info: #00d4ff;
  --purple: #ff00ff;
}
```

---

## Performance Tips

1. **Use CSS variables** instead of hardcoding colors
2. **Minimize animations** for better performance
3. **Use rgba() for transparency** instead of opacity
4. **Group similar rules** together
5. **Avoid deep selectors** like `.card .item .content .text`

---

## Backup Strategy

Before making major changes:

```bash
# Copy the original file
cp src/styles/vendor.css src/styles/vendor.css.backup

# Make your changes
# If something breaks, restore:
cp src/styles/vendor.css.backup src/styles/vendor.css
```

---

## Validation

After customizing, test:
- [ ] All buttons work
- [ ] Colors have good contrast
- [ ] Mobile responsive
- [ ] Animations smooth
- [ ] Forms work properly
- [ ] Tables display correctly
- [ ] Icons visible
- [ ] Loading states work
- [ ] Error states visible
- [ ] Success messages clear

---

## Additional Resources

- **CSS Variables**: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Color Contrast**: https://webaim.org/resources/contrastchecker/
- **Responsive Design**: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design
- **CSS Gradients**: https://developer.mozilla.org/en-US/docs/Web/CSS/gradient

---

**Last Updated**: May 29, 2026
**Version**: 1.0.0
