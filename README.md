---

# MansiR Project

**MansiR** is a social-environmental initiative that aims to reduce food waste by connecting individuals who want to **give** and **collect** food. This repository houses both the **backend** (Node.js + TypeScript + MySQL) and the **frontend** (React + TypeScript + Redux) portions of the application.

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots-optional)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
  - [1. Clone and Install](#1-clone-and-install)
  - [2. Backend Configuration](#2-backend-configuration)
  - [3. Frontend Configuration](#3-frontend-configuration)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Future Improvements](#future-improvements-optional)
- [License](#license-optional)

---

## Features

1. **Phone Number Verification**  
   Users register/login with a phone number, receiving a code via SMS simulation.  
2. **JWT-based Session**  
   After verifying their phone code, users receive a JWT to remain logged in and skip re-verification.  
3. **Preferences and Profile**  
   Users can set location and food preferences.  
4. **Food Giving/Collecting**  
   Users can upload meal details (with optional image) to give away. Others can collect it.  
5. **Map Integration**  
   A Leaflet/OpenStreetMap or Google Maps interface shows pickup locations.  
6. **Single Meal Restriction**  
   A user can only have one active meal at a time; they must “cancel” the existing meal before adding a new one.

---


## Tech Stack

- **Backend**: Node.js, Express, MySQL, TypeScript
- **ORM/DB**: mysql2 + connection pool
- **Authentication**: Phone code verification + JWT
- **Frontend**: React + Vite + TypeScript
- **State Management**: Redux Toolkit
- **Maps**: Leaflet + OpenStreetMap (or Google Maps, depending on your config)

---

## Architecture

```
Frontend (React + Redux)  <-->  Backend (Express + MySQL)
       ^                               ^
       |-------- (JWT Auth) ----------|
```

- **Routes**:
  - `/auth/send-code`, `/auth/verify-code` (phone-based login)
  - `/food/give`, `/food/:id`, DELETE `/food/:id` (managing food items)
  - `/preferences/...` (user preferences)
  - Plus any additional routes for user data, map coordinates, etc.

---

## Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/YourUsername/MansiR_Project.git
cd MansiR_Project
```

Install dependencies for both backend and frontend:

```bash
cd backend
npm install
npm run build   # compiles TypeScript
cd ../frontend
npm install
```

*(Alternatively, open two terminals—one in `backend`, one in `frontend`.)*

### 2. Backend Configuration

1. Create a **`.env`** file in the `backend` folder (if you don’t already have one). Example:

   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=mansiR_db
   PORT=3000

   # Phone code / reCAPTCHA
   RECAPTCHA_SECRET=your-recaptcha-secret

   # JWT
   JWT_SECRET=someSuperSecretValue
   JWT_EXPIRES_IN=1d
   ```

2. Ensure you have a MySQL server running. Create the database (`mansiR_db`) and run your schema (see [Database Schema](#database-schema)).
3. Run the server:

   ```bash
   # from /backend
   npm run build  # compiles TS to dist/
   npm start      # starts node dist/app.js
   ```

The API should be available at: [http://localhost:3000](http://localhost:3000)

### 3. Frontend Configuration

1. In the `frontend` folder, create a **`.env`** file for your Vite environment variables:

   ```bash
   VITE_API_BASE_URL=http://localhost:3000
   VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
   ```

2. Start the development server:

   ```bash
   # from /frontend
   npm run dev
   ```

   The frontend is at [http://localhost:5173](http://localhost:5173) by default.  
   *(You can configure a proxy or reference `VITE_API_BASE_URL` in fetch calls.)*

---

## Usage

1. **Registration**:  
   - Navigate to `http://localhost:5173/register`. Enter your phone; an SMS code is “sent” (simulated in logs).  
   - Verify code → fill final details.  

2. **Login**:  
   - Navigate to `http://localhost:5173/login`. Enter phone and code.  
   - On success, you receive a JWT, stored in localStorage (by default).  

3. **Create a Meal**:  
   - Go to “I want to give food.” Fill out the form.  
   - A meal row is inserted in `food_items`.  
   - You’re navigated to a “Meal Card” or “Map” view.  

4. **Cancel Meal**:  
   - From the same screen, click “Cancel Meal” → calls `DELETE /food/:id`.  
   - Freed up to create another meal.  

5. **Preferences**:  
   - If you have no preferences, you’re prompted to fill them.  

---

## Environment Variables

**Backend (`backend/.env`)**:
- `DB_HOST` / `DB_USER` / `DB_PASSWORD` / `DB_NAME`
- `PORT` (default 3000)
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (e.g. `1d`, `2h`)
- `RECAPTCHA_SECRET` (optional if you use Google reCAPTCHA)

**Frontend (`frontend/.env`)**:
- `VITE_API_BASE_URL` (e.g. `http://localhost:3000`)
- `VITE_RECAPTCHA_SITE_KEY` (if using reCAPTCHA)

---

## Database Schema

You have at least three tables:

1. **users**  
   ```sql
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255),
     username VARCHAR(100),
     email VARCHAR(255),
     gender ENUM('male','female','other'),
     phone VARCHAR(15),
     password VARCHAR(255),
     created_at TIMESTAMP,
     updated_at TIMESTAMP
   );
   ```

2. **user_preferences**  
   ```sql
   CREATE TABLE user_preferences (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT,
     city VARCHAR(255),
     radius INT,
     food_preference ENUM('Kosher vegetarian','Vegan','Vegetarian + fish','No preferences'),
     allergies VARCHAR(255),
     created_at TIMESTAMP,
     updated_at TIMESTAMP
   );
   ```

3. **food_items**  
   ```sql
   CREATE TABLE food_items (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT,
     item_description VARCHAR(255),
     pickup_address VARCHAR(255),
     box_option ENUM('need','noNeed'),
     food_types VARCHAR(255),
     ingredients VARCHAR(255),
     special_notes TEXT,
     image_url VARCHAR(255),
     approved TINYINT(1),
     created_at TIMESTAMP,
     updated_at TIMESTAMP
   );
   ```

*(You can alter columns as needed, e.g. using `utf8mb4` for storing non-ASCII text.)*

---

## Future Improvements (Optional)

- **Token Refresh**: Implement refresh tokens instead of single JWT usage.  
- **Real SMS API**: Integrate Twilio or similar to send real SMS codes.  
- **Map Integration**: Offer geocoding and address autocomplete.  
- **Multi-Language Support**: Expand beyond the default language.  

---

## License (Optional)

Choose a license you prefer (MIT, Apache 2.0, etc.). Example:

```
MIT License
Copyright (c) 2025 MansiR Project
Permission is hereby granted, free of charge...
```

--- 

**Enjoy saving food and reducing waste with MansiR!** If you have questions or encounter issues, please open a GitHub Issue or contact the maintainer.
