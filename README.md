# 🚀 Salesforce Validation Rule Manager

Salesforce Validation Rule Manager is a full-stack web application developed using React.js, Node.js, Express.js, and Salesforce OAuth 2.0 integration. The application allows users to securely log in to Salesforce, fetch validation rule metadata, enable or disable validation rules dynamically, and deploy changes directly to the Salesforce Org.

This project demonstrates real-time Salesforce metadata management with a clean and responsive user interface.

---

## ✨ Features

- 🔐 Secure Salesforce Login using OAuth 2.0
- 📋 Fetch Salesforce Validation Rules Metadata
- ⚡ Enable or Disable Individual Validation Rules
- ✅ Enable All / Disable All Functionality
- 🚀 Deploy Changes Directly to Salesforce Org
- ↩️ Rollback Validation Rules to Original State
- 👤 Displays Logged-in Username and Organization
- 🎨 Responsive and User-Friendly Interface
- 🔄 Real-time Salesforce Metadata Synchronization

---

## 🛠 Technologies Used

- React.js
- CSS3
- Node.js
- Express.js
- Salesforce Metadata API
- OAuth 2.0
- JSForce

---

## 📂 Project Structure

```bash
salesforce-validation-manager/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── App.js
│   ├── App.css
│   └── package.json
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
└── README.md

**⚙️ Setup Instructions**

**Frontend**
cd frontend
npm install
npm start

**Backend**
cd backend
npm install
node server.js

**🔄 Application Workflow**
1) User logs in securely using Salesforce OAuth 2.0.
2) Application fetches validation rules metadata from Salesforce.
3) User can enable or disable validation rules dynamically.
4) Changes can be deployed directly to Salesforce Org.
5) Rollback functionality restores original validation rule states.

**🎯 Key Functionalities**
● Dynamic Validation Rule Management
● Real-time Salesforce Metadata Fetching
● OAuth 2.0 Authentication Flow
● Deploy Changes to Salesforce Org
● Rollback to Original Validation States

👩‍💻 Developed By

Nikhila Telakuntla
