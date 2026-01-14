# 🚀 GigFlow - Premium Freelance Marketplace

<div align="center">

![GigFlow Banner](https://img.shields.io/badge/GigFlow-Premium%20Marketplace-6366f1?style=for-the-badge)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

**A modern, full-stack freelance marketplace with real-time features and premium UI/UX**

### 🌐 Live Demo
**Frontend:** [https://gig-flow-git-main-abhas-jaltares-projects.vercel.app](https://gig-flow-git-main-abhas-jaltares-projects.vercel.app)  
**Backend API:** [https://gigflow-wljp.onrender.com](https://gigflow-wljp.onrender.com)

[Features](#-key-features) · [Installation](#-installation) · [Tech Stack](#-tech-stack) · [Demo Credentials](#-demo-credentials)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Installation](#-installation)
- [Demo Credentials](#-demo-credentials)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)

---

## 🌟 Overview

**GigFlow** is a premium freelance marketplace built with the MERN stack, featuring a complete hiring lifecycle, real-time notifications, and a modern, high-end UI design. The platform enables clients to post projects and freelancers to submit proposals, with an atomic hiring system that ensures data consistency.

### Why GigFlow?

- ✨ **Premium UI/UX**: Glassmorphism, dark mode, gradient aesthetics, and smooth animations
- 🔒 **Secure Authentication**: JWT-based auth with HttpOnly cookies
- ⚡ **Real-time Updates**: Socket.io for instant notifications
- 🎯 **Atomic Transactions**: Race-condition-safe hiring logic
- 📱 **Responsive Design**: Works seamlessly on all devices
- 🎨 **Modern Design**: Industry-standard animations and transitions

---

## ✨ Key Features

### For Clients
- 📝 **Post Projects**: Create detailed gig listings with budget and requirements
- 👀 **View Proposals**: See all freelancer bids in one place
- ✅ **Hire Freelancers**: One-click hiring with automatic status updates
- 📊 **Dashboard Management**: Track all posted projects and their status
- 🔔 **Real-time Notifications**: Get notified when freelancers submit proposals

### For Freelancers
- 🔍 **Browse Gigs**: Explore available projects with detailed descriptions
- 💼 **Submit Proposals**: Place bids with custom pricing and cover letters
- 📈 **Track Applications**: Monitor proposal status (Pending, Hired, Rejected)
- 🎉 **Success Animations**: Beautiful feedback on proposal submission
- 📱 **Dashboard**: View all submitted proposals in one place

### Technical Features
- 🔐 **JWT Authentication**: Secure token-based authentication with HttpOnly cookies
- 🔄 **Atomic Hiring**: MongoDB transactions ensure data consistency
- 🌐 **Real-time Communication**: Socket.io for instant updates
- 🎨 **Premium Animations**: Smooth transitions and micro-interactions
- 📦 **Redux State Management**: Centralized state with Redux Toolkit
- 🛡️ **Protected Routes**: Role-based access control

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Socket.io** - Real-time engine
- **bcryptjs** - Password hashing

### DevOps & Tools
- **Vite** - Fast build tool
- **Git** - Version control
- **MongoDB Atlas** - Cloud database
- **npm** - Package manager

---

## 🎯 How It Works

### 1. **User Registration & Authentication**
- Users register as either **Clients** or **Freelancers**
- JWT tokens are issued and stored in HttpOnly cookies for security
- Protected routes ensure only authenticated users can access certain features

### 2. **Posting a Gig (Client)**
```
Client → Create Gig → Fill Details → Publish → Gig appears in Browse Gigs
```
- Clients create project listings with title, description, and budget
- Gigs are stored in MongoDB with status "open"
- All users can browse available gigs

### 3. **Submitting a Proposal (Freelancer)**
```
Freelancer → Browse Gigs → View Details → Submit Proposal → Success Animation
```
- Freelancers view gig details and submit bids with custom pricing
- Proposals are stored with status "pending"
- Real-time notification sent to the client

### 4. **Hiring Process (Client)**
```
Client → Dashboard → View Proposals → Click "Hire Now" → Confirm → Atomic Update
```
- Client reviews all proposals in the Dashboard
- Clicking "Hire Now" triggers an **atomic transaction**:
  - Selected bid status → "hired"
  - All other bids → "rejected"
  - Gig status → "assigned"
- All updates happen atomically (all or nothing) to prevent race conditions

### 5. **Dashboard Management**
- **Clients**: View posted gigs, see proposal counts, manage hiring
- **Freelancers**: Track submitted proposals, view application status
- Real-time updates reflect changes instantly

### 6. **Real-time Notifications**
- Socket.io connection established on login
- Notifications for new proposals, hiring decisions, etc.
- Instant UI updates without page refresh

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/abhass3j/GigFlow.git
cd gigflow---freelance-marketplace
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=30d
JWT_COOKIE_EXPIRES_IN=30
CLIENT_URL=http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

### 4. Seed the Database
```bash
cd ../server
npm run seed
```

This creates demo users, gigs, and bids for testing.

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

---

## 🔑 Demo Credentials

### Client Account
- **Email**: `alice@example.com`
- **Password**: `123456`

### Freelancer Accounts
- **Email**: `charlie@example.com` | **Password**: `123456`
- **Email**: `dave@example.com` | **Password**: `123456`

---

## 📁 Project Structure

```
gigflow---freelance-marketplace/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components (Navbar, ConfirmModal, etc.)
│   │   ├── pages/         # Page components (Home, Login, Dashboard, etc.)
│   │   ├── store/         # Redux slices (auth, gigs, bids)
│   │   ├── hooks/         # Custom hooks (useSocket)
│   │   ├── utils/         # Utility functions (api.js)
│   │   ├── App.jsx        # Main app component with routing
│   │   └── index.css      # Global styles and animations
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── controllers/       # Route controllers (auth, gigs, bids)
│   ├── models/            # Mongoose models (User, Gig, Bid)
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── config/            # Database configuration
│   ├── seeder.js          # Database seeding script
│   └── server.js          # Express server setup
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Gigs
- `GET /api/gigs` - Get all gigs
- `GET /api/gigs/:id` - Get single gig
- `POST /api/gigs` - Create gig (Protected)
- `GET /api/gigs/my-gigs` - Get user's gigs (Protected)

### Bids
- `POST /api/bids` - Place bid (Protected)
- `GET /api/bids/:gigId` - Get bids for a gig (Protected)
- `PATCH /api/bids/:bidId/hire` - Hire freelancer (Protected)
- `GET /api/bids/my-bids` - Get user's bids (Protected)

---



### Home Page
Modern landing page with hero section and latest gigs.

### Dashboard
Manage projects and proposals with expandable views.

### Login Page
Premium authentication with floating orbs and smooth animations.

### Gig Details
Detailed project view with proposal submission form.

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to Vercel or Netlify
3. Set environment variables for API URL

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@abhassj](https://github.com/abhassj)

---

## 🙏 Acknowledgments

- Design inspiration from modern SaaS platforms
- Icons from Heroicons
- Fonts from Google Fonts (Inter)

---

<div align="center">

**Built with ❤️ using the MERN Stack**

⭐ Star this repo if you find it helpful!

</div>
