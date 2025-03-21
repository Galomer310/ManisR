---
# MansiR Project

*MansiR* is a social-environmental initiative that aims to reduce food waste by connecting individuals who want to *give* and *collect* food. This repository houses both the *backend* (Node.js + TypeScript + MySQL) and the *frontend* (React + TypeScript + Redux) portions of the application.

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
