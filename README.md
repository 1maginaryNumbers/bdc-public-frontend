# 🌐 BDC Public Website

React-based public-facing website for the Vihara (Buddhist temple). This is the website that temple visitors and members can access to view temple information, events, announcements, and make donations.

---

## ⭐ About the Project

**BDC Public Website** is a modern, responsive website designed to assist:

- **Temple Visitors** 👥 - Access event information, schedules, and temple details
- **Congregation Members** 🙏 - View announcements, events, and gallery
- **Donors** 💰 - Make secure donations through integrated payment gateway

This website serves as the public face of the Vihara, providing a one-stop destination for all temple-related information and services.

---

## 🚀 Features

- 🏠 **Home Page** - Welcome page with temple information
- 📢 **Announcements** - View temple announcements and updates
- 📅 **Events** - Browse upcoming temple events and activities
- 🖼️ **Gallery** - View temple photos organized by categories
- 💳 **Donations** - Make donations through Midtrans payment integration
- 🛍️ **Merchandise** - Browse and view temple merchandise
- 🏛️ **Organizational Structure** - View temple leadership and organizational structure
- ℹ️ **About Us** - Learn about the temple

---

## 🔧 Technologies Used

- **Frontend**: React 19.2.0
- **Routing**: React Router DOM 7.9.4
- **Icons**: React Icons 5.2.1
- **Styling**: Tailwind CSS 3.4.0
- **HTTP Client**: Axios
- **Hosting**: Vercel

---

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd frontend-public
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

   For production:
   ```env
   REACT_APP_API_URL=https://your-backend-url.com
   ```

   ⚠️ **Important**: Never commit the `.env` file to version control. It is already included in `.gitignore`.

4. **Start the development server**:
   ```bash
   npm start
   ```

   Then, open `http://localhost:3000` in your browser.

---

## 📜 Available Scripts

### `npm start`
Runs the app in development mode. The page will reload when you make changes.

### `npm run build`
Builds the app for production to the `build` folder. The build is optimized for production.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run eject`
**Note: This is a one-way operation.** Ejects from Create React App configuration.

---

## 🗂️ Project Structure

```
frontend-public/
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
├── tailwind.config.js
└── package.json
```

---

## ✨ Key Features

### 📱 Responsive Design
- Built with Tailwind CSS for responsive layouts
- Mobile-friendly interface
- Modern and clean design

### 💳 Donation System
- View active donation events
- Make donations through Midtrans payment gateway
- Support for QRIS payment method
- Real-time transaction status updates

### 📄 Content Display
- Dynamic content loading from backend API
- Image galleries with category filtering
- Event listings with details
- Announcement feed

---

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration is in `tailwind.config.js`.

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard**:
   - `REACT_APP_API_URL`: Your backend API URL

---

## 📝 Notes

- The public website does not require authentication
- All content is fetched from the backend API
- Payment integration uses Midtrans for secure transactions
- Images are served from the backend uploads directory
- The website is optimized for SEO and performance

---

## 📄 License

This project is created and maintained by Vihara Buddhayana Dharmawira Centre. Licensing details are yet to be determined.
