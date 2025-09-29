# 🌽 THEFMSMKT CMNTYPLX - CORNMAN Food Delivery

<div align="center">
  
![THEFMSMKT Logo](https://img.shields.io/badge/THEFMSMKT-CMNTYPLX-39FF14?style=for-the-badge&logo=restaurant&logoColor=black)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/thefmsmkt-cornman)
[![Live Demo](https://img.shields.io/badge/Live-Demo-39FF14?style=for-the-badge&logo=vercel&logoColor=black)](https://thefmsmkt-cornman.vercel.app)

**Gourmet Street Food. Elevated Corn Dishes. Sustainable Delivery.**

### ⚡ Quick Deploy to Vercel
```bash
# Clone, setup and deploy in 3 commands
git clone https://github.com/YOUR_USERNAME/thefmsmkt-cornman.git
cd thefmsmkt-cornman
chmod +x deploy.sh && ./deploy.sh
```

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.io/)

</div>

## 🚀 Project Overview

THEFMSMKT CMNTYPLX (CORNMAN) is a modern, full-stack food delivery application specializing in gourmet corn dishes. Built with React and powered by Supabase, it offers a seamless ordering experience with real-time tracking, loyalty rewards, and sustainable delivery options.

### ✨ Key Features

- 🛒 **Smart Shopping Cart** - Add, modify, and manage orders with real-time calculations
- 🔐 **User Authentication** - Secure login/signup with session management
- 📍 **Location Services** - Find nearby locations and track deliveries
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🎯 **Order Tracking** - Real-time order status and delivery updates
- 💳 **Checkout System** - Streamlined payment flow with order confirmation
- 🏆 **Loyalty Program** - Points-based rewards system (in development)
- 🌙 **Dark Theme** - Modern dark UI with neon green (#39FF14) accents

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework with custom design system
- **shadcn/ui** - High-quality, accessible UI components
- **Material Icons** - Consistent iconography

### Backend & Services
- **Supabase** - Backend-as-a-Service (Database, Auth, Real-time, Storage)
- **Edge Functions** - Serverless API endpoints
- **PostgreSQL** - Relational database with real-time subscriptions

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and formatting
- **Context API** - State management for auth and cart

## 🎨 Design System

### Color Palette
```css
--neon-green: #39FF14      /* Primary accent color */
--brand-black: #000000     /* Background color */
--brand-white: #FFFFFF     /* Text color */
--neutral-900: #171717     /* Card backgrounds */
--neutral-800: #262626     /* Borders and inputs */
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Base Font Size**: 14px
- **Font Weights**: 400 (normal), 600 (semibold), 700 (bold), 800 (extrabold), 900 (black)

### Component Classes
```css
.btn-primary     /* Neon green button with hover effects */
.btn-secondary   /* Outlined button with neutral colors */
.card           /* Rounded card with dark background */
.neon-text      /* Neon green text color */
.neon-bg        /* Neon green background */
```

## 📁 Project Structure

```
src/
├── App.tsx                 # Main application component
├── components/             # Reusable UI components
│   ├── Header.tsx         # Navigation header with cart
│   ├── HeroSection.tsx    # Landing page hero
│   ├── MenuSection.tsx    # Food menu display
│   ├── CartSheet.tsx      # Sliding cart panel
│   ├── AuthModal.tsx      # Login/signup modal
│   ├── OrderTrackingSection.tsx  # Order status tracking
│   ├── LocationsSection.tsx      # Store locations
│   ├── ProfileSection.tsx        # User profile
│   ├── Footer.tsx         # Site footer
│   └── ui/               # shadcn/ui components
├── contexts/             # React Context providers
│   ├── AuthContext.tsx   # User authentication state
│   └── CartContext.tsx   # Shopping cart state
├── hooks/               # Custom React hooks
│   └── useGeolocation.tsx
├── utils/               # Utility functions
│   ├── api.tsx         # API client functions
│   ├── toast.tsx       # Toast notifications
│   └── supabase/       # Supabase configuration
├── styles/
│   └── globals.css     # Global styles and design tokens
└── supabase/
    └── functions/      # Edge functions
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Supabase account (for backend services)

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd thefmsmkt-cornman
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open in browser**
Navigate to `http://localhost:5173`

## 🎮 Usage Guide

### Navigation Flow
1. **Home** - Landing page with featured items and quick actions
2. **Menu** - Browse full menu with categories and filters
3. **Cart** - Review order, modify quantities, and checkout
4. **Tracking** - Monitor order status and delivery progress
5. **Locations** - Find nearby stores and delivery areas
6. **Profile** - Manage account settings and order history

### Key User Actions
```typescript
// Add item to cart
addToCart(item)

// Update item quantity
updateCartItem(id, quantity)

// Place order
handleCheckout()

// Track order
setActiveOrder(orderData)
```

## 🧩 Component Architecture

### Main App Structure
```typescript
App.tsx
├── Header (navigation, cart, auth)
├── Dynamic Section Rendering
│   ├── HeroSection (home)
│   ├── MenuSection (menu)
│   ├── OrderTrackingSection (tracking)
│   ├── LocationsSection (locations)
│   └── ProfileSection (profile)
├── Footer
├── CartSheet (sliding cart)
└── AuthModal (login/signup)
```

### State Management
- **Local State**: Component-level state with useState
- **Cart State**: Centralized cart management in App.tsx
- **Auth State**: User authentication status
- **Order State**: Active order tracking

## 🎯 Core Features Implementation

### Shopping Cart System
```typescript
// Cart functionality in App.tsx
const [cartItems, setCartItems] = useState([]);
const [cartTotal, setCartTotal] = useState(0);
const [cartCount, setCartCount] = useState(0);

// Add to cart with quantity handling
const addToCart = (item) => {
  // Merge existing items or add new
};
```

### Authentication Flow
```typescript
// AuthModal.tsx - Simple auth implementation
const [isLogin, setIsLogin] = useState(true);
const handleSubmit = (formData) => {
  // Mock authentication for prototype
};
```

### Order Tracking
```typescript
// OrderTrackingSection.tsx
const [activeOrder, setActiveOrder] = useState(null);
// Real-time order status updates
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 768px` - Stack navigation, simplified layout
- **Tablet**: `768px - 1024px` - Hybrid layout with collapsible elements  
- **Desktop**: `> 1024px` - Full layout with sidebar navigation

### Mobile Optimizations
- Hamburger menu navigation
- Touch-friendly button sizes
- Swipe gestures for cart
- Optimized image loading

## 🔮 Advanced Features Roadmap

### Phase 1 (Immediate)
- [ ] Enhanced authentication (social login, 2FA)
- [ ] Payment integration (Stripe, PayPal)
- [ ] Real-time order tracking with GPS
- [ ] Push notifications

### Phase 2 (Short-term)
- [ ] Loyalty program with tiers
- [ ] AI-powered recommendations
- [ ] Advanced analytics dashboard
- [ ] Mobile PWA implementation

### Phase 3 (Long-term)
- [ ] Machine learning personalization
- [ ] AR menu visualization
- [ ] Blockchain loyalty tokens
- [ ] IoT kitchen integration

## 🧪 Testing & Quality

### Code Quality
- TypeScript for type safety
- ESLint for code consistency
- Component-based architecture
- Accessibility-first design

### Performance Optimizations
- Lazy loading for components
- Image optimization
- Efficient state management
- Minimal bundle size

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow existing TypeScript and React patterns
2. **Components**: Create reusable, well-documented components
3. **Styling**: Use Tailwind CSS classes and design system tokens
4. **State**: Minimize state complexity, use Context for global state
5. **Testing**: Test critical user flows and edge cases

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

## 🚀 Deployment

### Build Production
```bash
npm run build
# or
yarn build
```

### Environment Variables
Ensure all required environment variables are set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📄 License

This project is part of the THEFMSMKT CMNTYPLX brand. All rights reserved.

## 🙋‍♂️ Support & Contact

For questions, issues, or feature requests:
- Create an issue in this repository
- Contact the development team
- Check the [Advanced Features Roadmap](./advanced-features.md)

---

<div align="center">

**Built with ❤️ for gourmet street food lovers**

*THEFMSMKT CMNTYPLX - Where tradition meets innovation*

</div>