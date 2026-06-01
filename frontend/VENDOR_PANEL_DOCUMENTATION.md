# Vendor Panel - Modern Design System Documentation

## Overview

The vendor panel has been completely redesigned with a modern, professional aesthetic featuring:

- **Dark Modern UI**: Professional dark slate theme with proper contrast ratios for readability
- **Real-Time Data**: All pages fetch and display live data from the backend
- **Responsive Design**: Fully responsive across all device sizes
- **Consistent Styling**: Unified design system using external CSS for easy maintenance
- **Modern Icons**: Professional icons from lucide-react library
- **Smooth Animations**: Fade-in, slide, and shimmer animations for loading states
- **Accessibility**: Proper semantic HTML, color contrast, and interactive elements

## Color Palette

```
Primary Background:    #0f172a (Dark Blue)
Secondary Background:  #111827 (Darker Blue)
Tertiary Background:   #0b1120 (Darkest Blue)
Text Primary:          #f1f5f9 (Light)
Text Secondary:        #cbd5e1 (Medium-Light)
Text Tertiary:         #94a3b8 (Medium)
Text Muted:            #475569 (Dim)
Border Color:          rgba(255, 255, 255, 0.08)

Status Colors:
- Success: #34d399 (Green)
- Warning: #fbbf24 (Yellow/Amber)
- Error: #f87171 (Red)
- Info: #60a5fa (Blue)
- Purple: #a78bfa (Purple)
```

## File Structure

```
frontend/
├── src/
│   ├── styles/
│   │   └── vendor.css                 # Main vendor design system
│   └── pages/
│       └── vendor/
│           ├── vendorDashboard.jsx    # Dashboard with key metrics
│           ├── vendorProducts.jsx     # Product management
│           ├── vendorCategories.jsx   # Category management
│           ├── vendorCoupons.jsx      # Coupon/discount management
│           ├── vendorOrders.jsx       # Order management
│           ├── vendorProfile.jsx      # Store profile & settings
│           └── vendorSubCategories.jsx # Subcategory management
```

## Component Architecture

### Vendor Dashboard
**Path**: `/vendor/:slug/dashboard`

Displays key metrics and quick insights:
- **Statistics Cards**: Total products, active coupons, pending orders, total revenue
- **Quick Actions**: Links to add products, create coupons, view orders
- **Recent Orders**: Table showing latest orders with status filters
- **Real-time Refresh**: Manual refresh button with loading state
- **Greeting**: Personalized greeting based on time of day

**Features**:
- Live data fetching from API
- Skeletal loading states
- Error handling with retry
- Status badge system
- Responsive grid layout

### Products Management
**Path**: `/vendor/:slug/products`

Complete product catalog management:
- **Search & Sort**: Filter by name, sort by price, newest first, etc.
- **Product Table**: Shows name, price, stock, status
- **Quick Actions**: Edit and delete buttons for each product
- **Status Badges**: Active/Inactive indicators
- **Product Count**: Shows total vs displayed products

**Features**:
- Real-time product list
- Advanced filtering
- Product images/icons
- Status indicators
- Empty state with call-to-action

### Categories Management
**Path**: `/vendor/:slug/categories`

Organize product categories:
- **Category Cards**: Grid view with category icon, name, description
- **Product Count**: Shows number of products in each category
- **Status Badges**: Active/Inactive status
- **Quick Actions**: Edit and delete buttons
- **Search Functionality**: Filter categories by name

**Features**:
- Grid or list view
- Category images/icons
- Product assignment tracking
- Empty state guidance

### Subcategories Management
**Path**: `/vendor/:slug/subcategories`

Manage product subcategories:
- **Parent Category Filter**: Filter by main category
- **Search**: Search across all subcategories
- **Item List**: Shows subcategory details with parent category
- **Status Indicators**: Active/Inactive status

**Features**:
- Hierarchical organization
- Category filtering
- Search functionality
- Batch operations ready

### Coupons & Discounts
**Path**: `/vendor/:slug/coupons`

Manage promotional coupons:
- **Stats Dashboard**: Total coupons, active count, total usage
- **Filter Tabs**: View all, active, or inactive coupons
- **Coupon Details**: Code, discount type/amount, expiration date
- **Toggle Controls**: Quick activate/deactivate
- **Usage Tracking**: Shows number of times coupon was used

**Features**:
- Real-time status switching
- Usage analytics
- Expiration date display
- Discount calculation display
- Quick actions

### Orders Management
**Path**: `/vendor/:slug/orders`

Comprehensive order tracking:
- **Stats Cards**: Pending orders, total orders, delivered count, revenue
- **Status Filters**: View orders by status (pending, processing, shipped, delivered, cancelled)
- **Order Items**: Shows order number, customer, date, amount
- **Status Badges**: Color-coded status indicators
- **Export Option**: Print/export functionality ready

**Features**:
- Multi-status filtering
- Customer information display
- Revenue tracking
- Order number system
- Date formatting (Indian locale)
- Print/export ready

### Vendor Profile
**Path**: `/vendor/:slug/profile`

Store profile and account settings:
- **Store Header**: Logo, name, creation date, verification status
- **Business Details**: Shop name, email, phone, description
- **Address Information**: Full address, city, state, pincode
- **Form Validation**: Input validation and error handling
- **Success Messages**: Confirmation of updates
- **Security Section**: Password change option

**Features**:
- Profile picture upload ready
- Form state management
- Save/cancel actions
- Success/error notifications
- Security options
- Responsive form layout

## CSS Design System

### Utility Classes

#### Spacing
```css
.gap-sm, .gap-md, .gap-lg
.p-xs, .p-sm, .p-md, .p-lg, .p-xl
.m-xs, .m-sm, .m-md, .m-lg, .m-xl
.mb-xs, .mb-sm, .mb-md, .mb-lg, .mb-xl
.mt-xs, .mt-sm, .mt-md, .mt-lg, .mt-xl
```

#### Typography
```css
.text-sm, .text-base, .text-lg
.font-500, .font-600, .font-700
.text-primary, .text-secondary, .text-tertiary, .text-muted
.text-center, .text-right
```

#### Layout
```css
.flex, .flex-between, .flex-center
.grid-auto, .grid-2, .grid-3
```

#### Components
- `.card` - Main content container
- `.stat-card` - Statistics display
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-success`
- `.badge`, `.badge-success`, `.badge-warning`, `.badge-error`, `.badge-info`
- `.item`, `.item-list` - List items with icon and text
- `.table`, `.table-container` - Data tables
- `.form-group`, `.form-row`, `.form-actions` - Forms
- `.empty-state` - No data state
- `.skeleton` - Loading placeholders

### Animations

```css
@keyframes shimmer    - Loading skeleton animation
@keyframes fadeIn     - Fade in effect
@keyframes fadeUp     - Fade in from bottom
@keyframes slideIn    - Slide in from left
@keyframes spin       - Rotation animation
@keyframes pulse      - Pulsing opacity
```

## Features & Implementation

### Real-Time Data
All pages fetch data from the backend API:
- Dashboard: `/api/vendor/:slug/me`, `/api/vendor/:slug/products`, etc.
- Products: `/api/vendor/:slug/products`
- Orders: `/api/vendor/:slug/orders`
- Categories: `/api/vendor/:slug/categories`
- Coupons: `/api/vendor/:slug/coupons`
- Profile: `/api/vendor/:slug/me`, profile endpoints

### Loading States
- Skeleton loaders for initial load
- Spinner for refresh actions
- Disabled state for buttons during loading
- Opacity reduction for loading containers

### Error Handling
- Error messages displayed in alert cards
- Retry functionality on most pages
- Graceful fallbacks for missing data
- Status-based error messages

### Search & Filter
- Real-time search filtering
- Multiple filter options
- Status-based filtering
- Category/parent filters

### Status System
Color-coded status indicators:
- **Pending**: Yellow/Amber - `#fbbf24`
- **Processing**: Blue - `#60a5fa`
- **Shipped**: Purple - `#a78bfa`
- **Delivered**: Green - `#34d399`
- **Cancelled**: Red - `#f87171`

## Responsive Design

All pages are fully responsive:
- **Desktop**: Multi-column grids, side-by-side layouts
- **Tablet**: 2-column grids, adjusted spacing
- **Mobile**: Single-column, full-width elements

Key breakpoints:
- 1024px: 3-column to 2-column
- 640px: Any grid to single-column

## Accessibility

- High contrast text (WCAG AA compliant)
- Semantic HTML structure
- Proper alt text for images
- Keyboard navigation ready
- Clear focus states on buttons
- Descriptive button titles

## Usage Guide

### Import the CSS
All vendor pages should import the vendor CSS:
```javascript
import "../../styles/vendor.css";
```

### Using Components

#### Stat Card
```jsx
<div className="stat-card">
  <div className="stat-icon primary">
    <Icon size={20} />
  </div>
  <div className="stat-value">123</div>
  <div className="stat-label">Total Items</div>
</div>
```

#### Button
```jsx
<button className="btn btn-primary">
  <Plus size={16} />
  Add Item
</button>
```

#### Form
```jsx
<div className="form-group">
  <label>Field Name</label>
  <input type="text" placeholder="Enter value" />
</div>
```

#### Table
```jsx
<div className="table-container">
  <table className="table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

#### Badge
```jsx
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-error">Cancelled</span>
```

## Customization

### Changing Colors
Edit CSS variables in `vendor.css`:
```css
:root {
  --primary-bg: #0f172a;
  --text-primary: #f1f5f9;
  /* ... more variables */
}
```

### Adding New Status Colors
Update the status colors in relevant components or add new badge classes:
```css
.badge-new-status {
  background: rgba(150, 100, 200, 0.12);
  color: #9664c8;
}
```

### Adjusting Spacing
Modify CSS variables:
```css
--spacing-lg: 16px;  /* Change default spacing */
```

## Best Practices

1. **Use Semantic Classes**: Use provided utility classes instead of inline styles
2. **Consistent Icons**: Use lucide-react icons consistently across all pages
3. **Loading States**: Always show loading skeletons for data fetching
4. **Error Handling**: Display meaningful error messages
5. **Responsive First**: Always test on mobile, tablet, and desktop
6. **Accessibility**: Maintain proper contrast and semantic HTML
7. **Performance**: Lazy load images and data
8. **Validation**: Add form validation before submission

## API Integration

Each page integrates with specific API endpoints:

```javascript
// Get vendor data
GET /api/vendor/:slug/me

// Products
GET /api/vendor/:slug/products
DELETE /api/vendor/:slug/products/:id

// Orders
GET /api/vendor/:slug/orders

// Categories
GET /api/vendor/:slug/categories
DELETE /api/vendor/:slug/categories/:id

// Coupons
GET /api/vendor/:slug/coupons
PATCH /api/vendor/:slug/coupons/:id (to toggle status)
DELETE /api/vendor/:slug/coupons/:id

// Subcategories
GET /api/vendor/:slug/subcategories
DELETE /api/vendor/:slug/subcategories/:id

// Profile
GET /api/vendor/:slug/me
PUT /api/vendor/:slug/profile
```

## Future Enhancements

Potential improvements:
- Bulk operations (delete multiple items)
- Advanced analytics dashboard
- Export to CSV/PDF
- Batch product uploads
- Inventory alerts
- Automated email notifications
- Customer review management
- Advanced reporting
- A/B testing on coupons
- Inventory forecasting

## Troubleshooting

### Data Not Loading
- Check API endpoint configuration
- Verify vendor slug is correct
- Check browser console for errors
- Ensure user is authenticated

### Styling Issues
- Clear browser cache
- Check CSS import path
- Verify vendor.css file exists
- Check for CSS class naming conflicts

### Performance Issues
- Lazy load images
- Implement pagination for large lists
- Cache API responses
- Minimize re-renders

## Support & Maintenance

For issues or improvements:
1. Check the component-specific documentation
2. Review the CSS variables and classes
3. Test on multiple browsers
4. Check responsive design
5. Validate API responses

---

**Last Updated**: 2026-05-29
**Version**: 1.0.0
**Status**: Production Ready
