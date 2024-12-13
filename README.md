# Dynamic Event Calendar Application

## Summary of Features

This application is a feature-rich, dynamic event calendar built with React.js. The app provides users with an intuitive and seamless interface to manage their schedules and events. Below are the highlights:

### **Core Features:**
- **Event Management:**
  - Add, edit, and delete events for specific dates.
  - Include event details like name, description, start time, end time, and type (Work, Personal, Holiday).
- **Dynamic Event Rendering:**
  - Displays events for the selected date in a color-coded list.
  - Filter events by keyword for easy navigation.
- **Event Overlap Prevention:**
  - Alerts users when attempting to schedule overlapping events.
- **Responsive Design:**
  - Optimized for both desktop and mobile devices.

### **Data Persistence:**
- **LocalStorage Integration:**
  - Automatically saves events to the browser’s local storage.
  - Events persist across page reloads and browser sessions.

### **Interactive Features:**
- **Toast Notifications:**
  - Displays success or error messages for key actions like adding, editing, or deleting events.
- **User-Friendly Modals:**
  - Provides a clean and intuitive modal for managing event details.

---

## Instructions to Run the App Locally

Follow these steps to set up and run the application on your local machine:

### **1. Clone the Repository:**
```bash
git clone <repository_url>
cd <repository_name>
```

### **2. Install Dependencies:**
Make sure you have Node.js and npm installed. Then, run:
```bash
npm install
```

### **3. Start the Development Server:**
```bash
npm start
```
The application will be accessible at [http://localhost:5173](http://localhost:5173).

### **4. Build for Production (Optional):**
To create an optimized build for production:
```bash
npm run build
```

---

## Link to the Deployed App

The application is deployed and can be accessed using the link below:

[Dynamic Event Calendar Application](<deployed_app_url>)

---

### **Additional Notes:**
- Make sure your browser supports LocalStorage for persistent data handling.
- For any issues, please raise an issue in the repository or contact the developer.

---
