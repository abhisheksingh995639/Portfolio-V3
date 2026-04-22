# 🚀 Dynamic Personal Portfolio

A modern, responsive, and fully dynamic personal portfolio website featuring a custom-built Admin Dashboard. This project enables seamless content management (CMS) directly from the browser without needing a separate backend server.

## ✨ Features

- **Striking UI/UX & Responsive Design**: Built with Tailwind CSS and glassmorphism design principles to ensure a beautiful experience on desktops, tablets, and mobile devices.
- **Dynamic Content Injection**: The frontend automatically fetches and renders portfolio data (Projects, Experience, Skills, and Analytics) directly from the database.
- **Secure Admin Panel (CMS)**: 
  - Complete control over your portfolio content.
  - Protected behind an authentication wall.
  - Perform CRUD (Create, Read, Update, Delete) operations on your Projects, Experience, and Skills dynamically.
- **Analytics Dashboard**: Tracks page views and resume downloads using data visualized via Chart.js.

## 🛠️ Tech Stack

- **Frontend Core**: HTML5, Vanilla JavaScript (ES6+), CSS3
- **Styling framework**: Tailwind CSS
- **Backend / BaaS**: [Firebase](https://firebase.google.com/)
  - *Firestore*: NoSQL database for storing portfolio content and analytics.
  - *Firebase Authentication*: Securing the admin portal.
  - *Storage* (Optional): For hosting project images and resumes.
- **Data Visualization**: Chart.js (for rendering skill levels and project categories)

## 📂 Project Structure

```
Portfolio/
├── index.html               # Main portfolio landing page
├── admin.html               # Secure Content Management System (CMS) board
├── input.css / output.css   # Tailwind CSS source and generated files
├── tailwind.config.js       # Tailwind configuration file
└── js/
    ├── main.js              # Frontend logic, Firebase data fetching, and UI rendering
    ├── admin.js             # Admin logic, Firebase Auth, and Firestore CRUD operations
    └── firebase-config.js   # Initialization of Firebase SDK & endpoints
```

## 🚀 Getting Started

### Prerequisites

To run this project, you need a local development server (Firebase Authentication does not work over the `file://` protocol). 

1. Install [Node.js](https://nodejs.org/) (which includes `npm`).
2. Have a quick local server method ready, like the **Live Server** extension in VS Code.

### Installation

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/your-username/your-portfolio-repo.git
   cd Portfolio
   ```

2. Generate the Tailwind CSS build (Optional if `output.css` is already updated):
   ```bash
   npm install
   npx tailwindcss -i ./input.css -o ./output.css --watch
   ```

3. Open the project using a local server:
   - If using VS Code, right-click `index.html` and select **"Open with Live Server"**.

## 🔐 Setup Firebase (Required for your own use)

Since this project uses Firebase, you must connect it to your own Firebase project to make it work.

1. Go to the [Firebase Console](https://console.firebase.google.com/) and Create a New Project.
2. Register a new Web App to get your Firebase configuration keys.
3. Enable **Firestore Database** (start in test mode or configure custom rules).
4. Enable **Authentication** (Choose Email/Password sign-in method).
   - *Go to the "Users" tab and manually add a new user with your secure email and password. This will be your admin login.*
5. Open `js/firebase-config.js` and replace the existing `firebaseConfig` object with your newly generated config.

## 📸 Usage

- **Main Page (`index.html`)**: Simply acts as the viewer. Any visitor will dynamically see what you publish on your database.
- **Admin Page (`admin.html`)**: Log in using your registered Firebase Authentication credentials to begin adding tags, experiences, projects, and managing what's visible on the main page.

## 💡 Customization

To personalize this portfolio, modify the UI components inside `index.html`. You can configure your global branding colors and typography via `tailwind.config.js`.

---
*Crafted with dedication.*
