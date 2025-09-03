# Eventro e-Hub - Event Services Marketplace

A complete, production-ready static UI kit for an event services marketplace targeting the Nigerian market.

## 🚀 Features

- **Complete Marketplace**: Browse, search, and book event services
- **Multi-User Dashboards**: Separate interfaces for organizers, vendors, and administrators
- **Real-time Cart System**: Add services to events with deposit calculations
- **Order Management**: Full order lifecycle with status tracking and messaging
- **Location Cascading**: Country → State → City selection for Nigerian markets
- **Mobile-First Design**: Fully responsive with accessibility compliance
- **Nigerian Currency**: Proper ₦ (Naira) formatting and realistic pricing

## 📁 Project Structure

```
/
├── index.html                     # Marketplace homepage
├── ehub/
│   ├── listings.html             # Browse/search services
│   └── listing.html              # Service detail page
├── organizer/
│   └── event-services.html       # Event planning cart
├── checkout.html                 # Deposit payment flow
├── order-confirmation.html       # Payment success page
├── vendor/
│   ├── dashboard.html            # Vendor overview
│   ├── listings.html             # Vendor listings management
│   ├── listing-form.html         # Create/edit listings
│   ├── orders.html               # Vendor orders
│   └── order.html                # Order detail with messaging
├── admin/
│   ├── index.html                # Admin dashboard
│   ├── listings.html             # Listing moderation
│   ├── orders.html               # Order management
│   ├── vendors.html              # Vendor management
│   └── payouts.html              # Payout processing
├── auth/
│   ├── login.html                # User authentication
│   └── register.html             # User registration
├── legal/
│   ├── terms.html                # Terms of service
│   └── privacy.html              # Privacy policy
└── assets/
    ├── css/
    │   ├── bootstrap.min.css     # Bootstrap 5.3 framework
    │   ├── font-awesome.min.css  # Font Awesome 6 icons
    │   └── styles.css            # Custom styles
    ├── js/
    │   ├── bootstrap.bundle.min.js
    │   ├── app.js                # Main application logic
    │   ├── modules/              # Modular JavaScript
    │   └── data/                 # Sample JSON data
    └── img/placeholders/         # Placeholder images
```

## 🛠 Technology Stack

- **Framework**: Bootstrap 5.3+ (no jQuery)
- **Icons**: Font Awesome 6
- **JavaScript**: Vanilla ES modules only
- **Currency**: Nigerian Naira (₦)
- **Accessibility**: WCAG-AA compliant

## 🎯 Key Functionality

### For Event Organizers
- Browse and search event services by category, location, and price
- View detailed service information with packages and pricing
- Add services to event cart with quantity selection
- Pay deposits securely (30% of total service cost)
- Track order status and communicate with vendors

### For Vendors
- Create and manage service listings with multiple packages
- Handle incoming orders with accept/reject functionality
- Track order status through completion
- Communicate with customers via built-in messaging
- View earnings and performance metrics

### For Administrators
- Moderate new vendor listings and registrations
- Monitor all platform orders and handle disputes
- Manage vendor KYC verification
- Process vendor payouts and reconciliation
- View platform analytics and health metrics

## 💰 Pricing & Payments

- **Deposit System**: Customers pay 30% deposit to secure bookings
- **Currency**: All prices in Nigerian Naira (₦)
- **Sample Price Ranges**:
  - Sound System: ₦150,000 - ₦600,000
  - Catering: ₦2,500,000 - ₦4,500,000  
  - Photography: ₦500,000 - ₦1,500,000
  - Security: ₦100,000 - ₦180,000

## 🌍 Location Coverage

Supports major Nigerian cities including:
- **Lagos State**: Lagos Island, Victoria Island, Ikeja, Lekki
- **FCT**: Abuja, Gwagwalada, Kuje, Bwari
- **Rivers State**: Port Harcourt, Obio-Akpor, Eleme
- **Oyo State**: Ibadan, Ogbomoso, Oyo
- **Enugu State**: Enugu, Nsukka, Oji River
- **Kano State**: Kano, Wudil, Gwarzo

## 🚀 Getting Started

1. **Open the Template**: Simply open `index.html` in a web browser
2. **Browse Services**: Navigate to different sections using the main navigation
3. **Test Functionality**: Use the demo login options in the auth pages

### Demo Access

Quick demo access buttons are available on the login page:
- **Vendor Dashboard**: Experience the vendor interface
- **Admin Panel**: View administrative controls  
- **Organizer Flow**: Test the event planning process

## 📊 Sample Data

The template includes realistic sample data:

- **13 Service Categories**: From catering to transportation
- **12+ Sample Listings**: Across multiple Nigerian cities
- **Vendor Profiles**: Complete with ratings and response times
- **Order History**: Various order states and statuses
- **Reviews**: Authentic-looking customer feedback

## ⚙️ Configuration

### Deposit Percentage
To change the deposit percentage, modify the `DEPOSIT_PERCENTAGE` constant in `/assets/js/modules/cart.js`:

```javascript
const DEPOSIT_PERCENTAGE = 0.3; // 30% deposit
```

### Adding New Categories
Add new service categories in `/assets/js/data/categories.json`:

```json
{
  "id": 14,
  "name": "New Category",
  "icon": "fas fa-icon-name",
  "description": "Category description"
}
```

### Adding New Listings
Add new service listings in `/assets/js/data/listings.json` following the existing structure.

## 🎨 Design System

- **Primary Color**: Bootstrap Success Green (#198754)
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Card-based layouts with subtle shadows
- **Interactions**: Smooth hover states and micro-animations

## ♿ Accessibility Features

- Skip links for keyboard navigation
- Proper ARIA labels and roles
- High contrast focus states
- Screen reader friendly content
- Semantic HTML structure
- Keyboard navigation support

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px  
  - Desktop: > 1024px
- **Touch Friendly**: Large tap targets and swipe gestures

## 🔧 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

This template is provided as-is for demonstration purposes. Customize and adapt as needed for your specific requirements.

## 🤝 Support

For questions about implementation or customization, refer to the inline code comments and documentation within each module.