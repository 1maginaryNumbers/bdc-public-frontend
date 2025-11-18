# Vihara Management System - Public Website

React-based public-facing website for the Vihara (Buddhist temple). This is the website that temple visitors and members can access to view temple information, events, announcements, and make donations.

## Features

- **Home Page**: Welcome page with temple information
- **Announcements**: View temple announcements and updates
- **Events**: Browse upcoming temple events and activities
- **Gallery**: View temple photos organized by categories
- **Donations**: Make donations through Midtrans payment integration
- **Merchandise**: Browse and view temple merchandise
- **Organizational Structure**: View temple leadership and organizational structure
- **About Us**: Learn about the temple

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API server running (see backend README)

## Installation

1. Navigate to the public directory:
   ```bash
   cd frontend/public
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend/public` directory:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

   For production:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

4. Start the development server:
   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

## Available Scripts

### `npm start`
Runs the app in development mode. The page will reload when you make changes.

### `npm run build`
Builds the app for production to the `build` folder. The build is optimized for production.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run eject`
**Note: This is a one-way operation.** Ejects from Create React App configuration.

## Environment Variables

Create a `.env` file in the `frontend/public` directory:

```
REACT_APP_API_URL=http://localhost:5000
```

**Important**: Never commit the `.env` file to version control. It is already included in `.gitignore`.

## Project Structure

```
frontend/public/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── Home.js
│   │   ├── Pengumuman.js
│   │   ├── Kegiatan.js
│   │   ├── Galeri.js
│   │   ├── Donasi.js
│   │   ├── Merchandise.js
│   │   ├── StrukturOrganisasi.js
│   │   ├── AboutUs.js
│   │   └── Layout.js
│   ├── App.js
│   └── index.js
└── package.json
```

## Key Features

### Responsive Design
- Built with Tailwind CSS for responsive layouts
- Mobile-friendly interface
- Modern and clean design

### Donation System
- View active donation events
- Make donations through Midtrans payment gateway
- Support for QRIS payment method
- Real-time transaction status updates

### Content Display
- Dynamic content loading from backend API
- Image galleries with category filtering
- Event listings with details
- Announcement feed

## Technologies Used

- React 19.2.0
- React Router DOM 7.9.4
- React Icons 5.2.1
- Tailwind CSS 3.4.0
- Axios (via backend API)

## Styling

This project uses Tailwind CSS for styling. The configuration is in `tailwind.config.js`.

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - `REACT_APP_API_URL`: Your backend API URL

## Notes

- The public website does not require authentication
- All content is fetched from the backend API
- Payment integration uses Midtrans for secure transactions
- Images are served from the backend uploads directory
- The website is optimized for SEO and performance
