# 🎵 MusicOn - Full-Stack Music Streaming & Management Platform

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Build_Tool-Vite-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)

**MusicOn** is a modern, full-stack music streaming platform inspired by Spotify and SoundCloud. Built with a sleek dark-mode aesthetic, it features real-time audio playback, interactive UI components, user playlist management, SoundCloud chart streaming, administrative upload controls, and role-based access control (RBAC).

---

## 🚀 Live Links
- **Frontend App**: [MusicOn Platform](https://music-on-wisemen.vercel.app)
- **Backend API**: [MusicOn API Engine](https://musicon-fullstack.onrender.com)

---

## 📸 Application Showcase

> *Replace the image links below with your screenshot files or URLs.*

### 🏠 User Home Dashboard
<!-- 📷 [PASTE PICTURE OF HOME PAGE / USER DASHBOARD HERE] -->
![User Home Page](image.png)

### 💿 Albums & Interactive Border Glow Cards
<!-- 📷 [PASTE PICTURE OF ALBUMS SECTION & BORDER GLOW HERE] -->
![Albums Section](image.png)

### 🎧 SoundCloud Discover Charts
<!-- 📷 [PASTE PICTURE OF SOUNDCLOUD DISCOVER SECTION HERE] -->
![Discover Section](image.png)

### 💖 Playlists & Liked Songs
<!-- 📷 [PASTE PICTURE OF PLAYLIST & LIKED SONGS PAGE HERE] -->
![Playlists Page](image.png)

### 🛠️ Admin Dashboard Overview
<!-- 📷 [PASTE PICTURE OF ADMIN OVERVIEW DASHBOARD HERE] -->
![Admin Dashboard Overview](image-1.png)

### ➕ Add Song & Add Album Management
<!-- 📷 [PASTE PICTURE OF ADD SONG / ADD ALBUM PAGE HERE] -->
![Add Album & Song](image-1.png)

### 🔐 Superadmin Role Registry & Security Scanner
<!-- 📷 [PASTE PICTURE OF SUPERADMIN ACCESS CONTROL REGISTRY HERE] -->
![Superadmin Registry](image-1.png)

---

## ✨ Features

### 👤 User Experience
- **Interactive Music Player**: Full-featured persistent bottom player with play/pause, scrub bar, volume control, track queue, and SoundCloud stream integration.
- **Dynamic Glitch Headers**: Interactive `<GlitchText />` dynamic greeting based on time of day.
- **Glowing UI Cards**: Hover-sensitive `<BorderGlow />` component on featured cards.
- **SoundCloud Charts Discover**: Stream full high-quality tracks directly via SoundCloud API integration.
- **Custom Playlists**: Create, manage, and add tracks to custom user playlists.
- **Liked Songs**: Quick one-click heart icon to save favorite tracks.

### 🛠️ Admin Management
- **Content Creation**: Upload custom tracks, assign album covers, and create new albums.
- **Dual Destination Upload**: Choose to assign new tracks directly to an Album or a Playlist upon upload.
- **Live Analytics**: Monitor track uploads, album metrics, and listener activity.
- **Cloudinary Integration**: Automated cloud media processing and storage cleanup.

### 🔐 Superadmin Control
- **Passwordless Entry**: Access control authenticated via secret URL access keys.
- **Role Registry Matrix**: Manage permissions across `User`, `Admin`, and `Superadmin` tiers.
- **Security Scanner**: Visual ambient scanner status overlay on administrative portals.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS, Vanilla CSS Design System
- **Icons**: Lucide React
- **Custom Motion Components**: `<GlitchText />`, `<BorderGlow />`, `<EchoText />`, `<Scanner />`
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT) & HTTP-Only Cookies
- **Media Engine**: Cloudinary API (Audio & Artwork Uploads)
- **External API**: SoundCloud Transcoding & Track Search API

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
- [Node.js (v18+)](https://nodejs.org/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB instance
- [Cloudinary Account](https://cloudinary.com/) (for audio & image hosting)

---

### 2. Backend Setup

```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install
```

Create a `.env` file inside `Backend/`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SUPERADMIN_KEY=your_superadmin_secret_key

# Cloudinary Config
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```

Run the Backend server:
```bash
npm run server
```

---

### 3. Frontend Setup

```bash
# Navigate to Frontend directory
cd Frontend

# Install dependencies
npm install
```

Create a `.env` file inside `Frontend/`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Run the Frontend development server:
```bash
npm run dev
```

---

## 📁 Repository Structure

```
Spotify full stack/
├── Backend/
│   ├── src/
│   │   ├── config/         # Database & Cloudinary config
│   │   ├── controllers/    # Route controllers (Auth, Song, Album, Playlist, Admin)
│   │   ├── middleware/     # Auth & Role verification middleware
│   │   ├── models/         # Mongoose DB Schemas
│   │   ├── routes/         # API endpoints
│   │   └── utils/          # SoundCloud helper utilities
│   ├── server.js           # Server entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── assets/         # Images & static media
│   │   ├── components/     # UI Components (Player, Sidebar, Navbar, Shared FX)
│   │   ├── context/        # React Context (PlayerContext, AuthContext)
│   │   ├── pages/          # User, Admin, and Superadmin views
│   │   └── utils/          # API & SoundCloud client handlers
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
