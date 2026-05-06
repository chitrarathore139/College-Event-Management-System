# 🎓 College Event Management System

## 📖 Description

The **College Event Management System** is a full-stack web application designed to streamline the process of managing college events. It allows users to browse events, register for them, and provides backend support for handling registrations efficiently.

The project combines a **static frontend (HTML, CSS, JavaScript)** with a **Node.js + Express backend** and database integration.

---

## 🚀 Features

### 👤 User Side

* View available events
* Register for events
* Interactive UI with multiple pages
* Chatbot interface (basic support system)

### 🔐 Admin Side

* Admin panel (`admin.html`)
* Event management interface

### ⚙️ Backend Features

* REST API for event registration
* Prevents duplicate registrations
* MongoDB integration
* CORS enabled for cross-origin requests

---

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB (via custom DB connection)

---

## 📂 Project Structure

```
College-Event-Management-System/
│
├── index.html              # Home page
├── events.html             # Events listing
├── register.html           # Event registration
├── login page.html         # User login
├── admin.html              # Admin panel
├── chatbot.html            # Chatbot interface
├── certificate.html        # Certificate page
├── verify.html             # Verification page
│
├── styles.css              # Styling
├── script.js               # Frontend logic
├── Registration.js         # Registration handling
│
├── server.js               # Main backend server
├── routes.js               # API routes
├── config.js               # Configuration
│
├── images/                 # Logos & assets
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/college-event-management-system.git
cd college-event-management-system
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup Database

* Configure MongoDB connection inside:

```
config/db.js
```

### 4️⃣ Run the server

```bash
node server.js
```

Server will run on:

```
http://localhost:5000
```

---

## 🔌 API Endpoints

### Register for Event

```
POST /api/events/register
```

### Request Body

```json
{
  "eventId": "event123",
  "userId": "user123"
}
```

### Responses

* ✅ Success: `Registration successful`
* ❌ Error: `Already registered`


---

## 🎯 Usage

1. Open `index.html` in browser
2. Navigate to events
3. Register for an event
4. Backend stores registration
5. Duplicate registrations are prevented

---

## 🔮 Future Improvements

* User authentication with JWT
* Payment gateway integration
* Email confirmation system
* Event analytics dashboard
* Mobile responsive improvements

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repo and submit a pull request.

---

## 👩‍💻 Author

Chitra Rathore

---
