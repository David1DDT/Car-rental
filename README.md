
# 🚗 Autodomi - Car Rental Platform

![GitHub Stars](https://img.shields.io/github/stars/David1DDT/car-rental?style=for-the-badge)
![GitHub Forks](https://img.shields.io/github/forks/David1DDT/car-rental?style=for-the-badge)
![GitHub Issues](https://img.shields.io/github/issues/David1DDT/car-rental?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge)
![Express.js](https://img.shields.io/badge/Express.js-5.0.0-green?style=for-the-badge)

## 🚀 Overview

**Autodomi** is a comprehensive car rental platform that allows users to easily find, book, and manage car rentals with a seamless user experience. Built with modern technologies, this platform offers a complete solution for both customers and administrators.

### Key Features:
✅ **User-Friendly Interface** - Intuitive Next.js frontend with responsive design
✅ **Car Search & Filtering** - Advanced search with date and location filters
✅ **Multiple Payment Options** - Stripe integration for secure online payments
✅ **Admin Dashboard** - Full CRUD operations for car management
✅ **Reservation System** - Date-based availability checking
✅ **Image Uploads** - Multiple car image uploads with multer
✅ **Authentication** - Secure admin login with JWT
✅ **Responsive Design** - Works on all devices with Tailwind CSS

## 🛠️ Tech Stack

### Frontend:
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + FlyonUI
- **Date Picking**: Flatpickr
- **File Uploads**: Dropzone
- **State Management**: React hooks

### Backend:
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with TypeGoose ORM
- **Authentication**: JWT
- **Payments**: Stripe API
- **File Storage**: Multer for image uploads

### Dev Tools:
- **Linting**: ESLint with Next.js configuration
- **Build Tool**: TypeScript compiler
- **Testing**: Unit test ready structure

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Stripe account (for payment processing)

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/David1DDT/car-rental.git
   cd car-rental
   ```

2. **Set up environment variables**:
   Create `.env` files in both `client` and `server` directories with the following variables:

   **Client/.env**:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
   ```

   **Server/.env**:
   ```env
   PORT=4000
   DB_URI=mongodb://localhost:27017/carRental
   SECRET_KEY=your_jwt_secret_key
   STRIPE_SK=your_stripe_secret_key
   FRONTEND_URL=http://localhost:3000
   ```

3. **Install dependencies**:
   ```bash
   # In client directory
   cd client
   npm install

   # In server directory
   cd ../server
   npm install
   ```

4. **Run the development servers**:
   ```bash
   # In client directory (opens on http://localhost:3000)
   npm run dev

   # In server directory (opens on http://localhost:4000)
   npm run dev
   ```


## 🎯 Usage

### Basic Usage Examples

**Searching for available cars**:
```typescript
// This is how the search functionality works in the frontend
const searchCars = async (startDate: string, endDate: string, location: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cars`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate, endDate, loc: location }),
    });

    const data = await response.json();
    return data.cars;
  } catch (error) {
    console.error("Error searching cars:", error);
    return [];
  }
};
```

**Admin car creation**:
```typescript
// Admin creates a new car with images
const createNewCar = async (carData: {
  name: string;
  transmission: string;
  fuel: string;
  price: number;
  class: string;
  category: string;
  location: string;
  images: File[];
}) => {
  const formData = new FormData();
  carData.images.forEach(image => formData.append('images', image));

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/upload-car`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });

  return response.json();
};
```

### Advanced Usage

**Creating a Stripe checkout session**:
```typescript
// Backend controller for creating checkout session
export const createCheckoutSession = async (req: Request, res: Response) => {
  const { startDate, endDate, loc, id, customerType, email, phone, name } = req.body;

  const car = await CarModel.findById(id);
  const timeInterval = daysBetween(new Date(startDate), new Date(endDate));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: car.name,
            images: car.images.map(img => `${process.env.BACKEND_URL}/api/cars/images/${img}`)
          },
          unit_amount: car.price * 100 * timeInterval
        },
        quantity: 1
      }
    ],
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`
  });

  return res.status(200).json({ sessionId: session.id });
};
```

## 📁 Project Structure

```
car-rental/
├── client/                  # Next.js frontend application
│   ├── app/                 # Next.js application routes
│   ├── components/          # Reusable UI components
│   ├── public/              # Static assets
│   ├── styles/              # Global styles
│   ├── utils/               # Utility functions
│   ├── package.json         # Client dependencies
│   └── tsconfig.json        # TypeScript configuration
│
├── server/                  # Express backend application
│   ├── src/                 # Source code
│   │   ├── modules/          # Business logic modules
│   │   ├── middleware/       # Express middleware
│   │   ├── utils/            # Utility functions
│   │   └── main.ts          # Server entry point
│   ├── package.json         # Server dependencies
│   └── tsconfig.json        # TypeScript configuration
│
├── .gitignore               # Git ignore rules
├── README.md                # Project documentation
└── ...
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Frontend URL for backend API | `http://localhost:4000` |
| `PORT` | Server port | `4000` |
| `DB_URI` | MongoDB connection string | `mongodb://localhost:27017/carRental` |
| `SECRET_KEY` | JWT secret key | `your_jwt_secret_key` |
| `STRIPE_SK` | Stripe secret key | `your_stripe_secret_key` |
| `FRONTEND_URL` | Frontend URL for redirects | `http://localhost:3000` |

### Customization Options

1. **Theming**: Easily change the color scheme by modifying the Tailwind CSS variables in `globals.css`
2. **Car Categories**: Update the category system in the admin dashboard
3. **Pricing**: Adjust price calculations in the backend service
4. **Location Support**: Add more locations to the location dropdown

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Setup

1. Fork the repository
2. Clone your fork locally
3. Install dependencies as shown in the installation section
4. Create a new branch for your feature/bugfix

### Code Style Guidelines

- Use TypeScript for all code
- Follow consistent naming conventions:
  - `camelCase` for variables and functions
  - `PascalCase` for classes and interfaces
  - `UPPER_CASE` for constants
- Write modular code with clear separation of concerns
- Include proper TypeScript types and interfaces
- Write comprehensive unit tests (coming soon)

### Pull Request Process

1. Create a descriptive commit message
2. Ensure your code passes all tests
3. Submit a pull request with a clear description of changes
4. Address any feedback from maintainers

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👥 Authors & Contributors

**Maintainer**:
- [David1DDT](https://github.com/David1DDT) - Initial development

**Special Thanks**:
- TypeScript community for excellent documentation
- Next.js team for the incredible framework
- Stripe team for payment processing solutions
- MongoDB team for the flexible database

## 🐛 Issues & Support

### Reporting Issues

If you encounter any problems or have feature requests:
1. Search existing issues to avoid duplicates
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected behavior
   - Your environment details

### Getting Help

- **Discussions**: For general questions and ideas
- **GitHub Issues**: For bugs and feature requests
- **Community**: Join our [Discord server](link-to-discord) for real-time help

## 🗺️ Roadmap

### Planned Features

✅ **Core Functionality** - Completed
- [ ] Enhanced search filters
- [ ] User accounts and profiles
- [ ] Rating and review system
- [ ] Admin analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support

### Known Issues

- [ ] Image upload validation could be more robust
- [ ] Some edge cases in date validation
- [ ] Payment webhook testing improvements

### Future Improvements

- Add more payment methods (PayPal, etc.)
- Implement loyalty program
- Add vehicle maintenance tracking
- Create a mobile app

## 🚀 Getting Started with Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/David1DDT/car-rental.git
   ```

2. **Set up your development environment**:
   ```bash
   # Install dependencies
   cd car-rental/client && npm install
   cd ../server && npm install

   # Start development servers
   cd ../client && npm run dev
   cd ../server && npm run dev
   ```

3. **Start coding!** Make changes to the codebase and see your changes in real-time.

## 🎉 Ready to Contribute?

We're excited to see what you'll build with Autodomi! Whether you're fixing bugs, adding features, or improving documentation, your contributions are welcome.

Let's make car rentals easier, faster, and more enjoyable for everyone!

🚀 **Star this repository** to show your support and stay updated with the latest developments!
```

This comprehensive README.md provides:

1. A compelling overview with clear value proposition
2. Detailed technical stack information
3. Step-by-step installation instructions
4. Practical usage examples with code snippets
5. Clear project structure visualization
6. Contribution guidelines for developers
7. Roadmap of future improvements
8. Professional formatting with emojis and badges
9. Environment configuration details
10. Encouragement for community involvement

The README is designed to attract developers to contribute to the project while providing all necessary information for both new and experienced developers to get started and understand the codebase.
