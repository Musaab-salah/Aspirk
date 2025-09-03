# SigmaPart - نظام طلب قطع الغيار من الإمارات

A comprehensive spare parts ordering system for the UAE market, built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

### Customer Features
- **Car Selection**: Step-by-step car brand, model, and year selection
- **Spare Parts Catalog**: Browse and search spare parts with filters
- **Request System**: Submit price requests for selected parts
- **Order Tracking**: Track order status from request to delivery
- **Customer Dashboard**: View order history and invoices
- **Bilingual Support**: Full Arabic and English interface

### Admin Features
- **Dashboard**: Comprehensive statistics and overview
- **Order Management**: Review, approve, reject, and track orders
- **Customer Management**: View and manage customer information
- **Spare Parts Management**: Add, edit, and manage spare parts catalog
- **Supplier Management**: Manage supplier information and pricing
- **Invoice Generation**: Generate and manage invoices
- **Reports**: Sales and performance analytics

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Icons**: Heroicons
- **State Management**: Zustand
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **PDF Generation**: jsPDF
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL (planned)
- **Backend**: Node.js/Express (planned)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sigmapart-uae
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
sigmapart-uae/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── Header.tsx         # Main navigation
│   ├── Footer.tsx         # Footer component
│   ├── CarSelector.tsx    # Car selection component
│   ├── StepNavigation.tsx # Step-by-step navigation
│   └── SparePartCard.tsx  # Spare part display card
├── types/                 # TypeScript interfaces
│   └── index.ts           # Main type definitions
├── lib/                   # Utility functions
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## 🎯 User Journey

### Customer Flow
1. **Homepage**: Landing page with search and car selector
2. **Car Selection**: Choose brand → model → year
3. **Parts Catalog**: Browse and filter spare parts
4. **Request Submission**: Select parts and submit request
5. **Order Tracking**: Monitor order status and receive updates
6. **Payment & Delivery**: Complete payment and receive parts

### Admin Flow
1. **Dashboard**: Overview of orders and statistics
2. **Order Review**: Review pending requests
3. **Price Confirmation**: Set final prices and shipping costs
4. **Customer Communication**: Send invoices and updates
5. **Order Management**: Track shipping and delivery

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) - Main brand color
- **Success**: Green (#22C55E) - Success states
- **Warning**: Orange (#F59E0B) - Warning states
- **Danger**: Red (#EF4444) - Error states
- **Secondary**: Gray (#64748B) - Secondary elements

### Typography
- **Arabic**: Noto Sans Arabic
- **English**: Inter
- **RTL Support**: Full right-to-left layout support

### Components
- **Buttons**: Primary, secondary, success, warning, danger variants
- **Cards**: Consistent card layouts with shadows
- **Forms**: Styled form inputs and validation
- **Status Badges**: Color-coded status indicators

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet**: Responsive layouts for tablets
- **Desktop**: Full-featured desktop experience
- **Touch Friendly**: Optimized for touch interactions

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Tailwind**: Utility-first CSS framework

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Static site deployment
- **AWS**: Full-stack deployment
- **Docker**: Containerized deployment

## 📊 Database Schema (Planned)

### Core Tables
- `users` - Customer and admin accounts
- `car_brands` - Car manufacturers
- `car_models` - Car models by brand
- `spare_parts` - Spare parts catalog
- `orders` - Customer orders
- `order_items` - Items in each order
- `suppliers` - Parts suppliers
- `invoices` - Generated invoices

## 🔐 Security Features

- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Input Validation**: Server-side validation
- **CSRF Protection**: Cross-site request forgery protection
- **Rate Limiting**: API rate limiting
- **Data Encryption**: Sensitive data encryption

## 📈 Performance

- **Next.js Optimization**: Automatic code splitting
- **Image Optimization**: Next.js Image component
- **Caching**: Static generation and caching
- **CDN**: Content delivery network support
- **Lazy Loading**: Component and image lazy loading

## 🌍 Internationalization

- **Arabic Support**: Full RTL layout and Arabic text
- **English Support**: English interface available
- **Localization**: Date, number, and currency formatting
- **Cultural Adaptation**: UAE-specific content and features

## 📞 Support

For support and questions:
- **Email**: support@spareparts-uae.ae
- **Phone**: +971 50 123 4567
- **Documentation**: [Link to documentation]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Basic UI components
- [x] Car selection system
- [x] Spare parts catalog
- [x] Request submission
- [x] Admin dashboard

### Phase 2 (Next)
- [ ] Backend API development
- [ ] Database integration
- [ ] Authentication system
- [ ] Payment integration
- [ ] Email notifications

### Phase 3 (Future)
- [ ] Mobile app development
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] API integrations
- [ ] Advanced reporting

---

**Built with ❤️ for the UAE market**
