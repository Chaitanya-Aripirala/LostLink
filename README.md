# LostLink – Lost and Found Management System

LostLink is a full-stack web application designed to help users report, search, and recover lost and found items within a college or organizational environment.

The system provides separate workflows for reporting lost items and found items, automatically identifies potential matches between them using a similarity-based matching engine, and notifies users when a possible match is detected.

---

## 📌 Project Overview

Losing personal belongings such as mobile phones, laptops, chargers, wallets, ID cards, bags, and other items is a common problem in colleges and large organizations.

Traditional lost-and-found systems usually depend on manually checking notices or contacting administrators. This can be time-consuming and makes it difficult to identify whether a reported lost item matches an item that someone else has found.

**LostLink** solves this problem by providing a centralized digital platform where:

* Users can create accounts.
* Users can report lost items.
* Users can report found items.
* Users can browse available lost and found items.
* The system automatically compares lost and found reports.
* Potential matches are generated using multiple item attributes.
* Users receive notifications when potential matches are found.
* Users can submit and manage claims.
* Users can view their dashboard and profile.
* Administrators can access administrative dashboard information.

The application follows a client-server architecture with a React frontend and Node.js/Express backend.

---

## ✨ Features

### 👤 User Authentication

Users can:

* Register for a new account.
* Log in securely.
* Access protected pages after authentication.
* View and update their profile.
* Use role-based access for normal users and administrators.

Authentication is implemented using JSON Web Tokens (JWT).

---

### 🔎 Report Lost Items

Users can report an item they have lost by providing information such as:

* Item title
* Category
* Description
* Image
* Color
* Brand
* Location where the item was lost
* Date and time
* Unique identifying details
* Verification question
* Verification answer

This information is later used by the matching engine to identify possible found-item matches.

---

### 📦 Report Found Items

Users can also report items that they have found.

Found-item reports contain information such as:

* Item title
* Category
* Description
* Image
* Color
* Brand
* Location where the item was found
* Date and time
* Unique details
* Verification information

Found reports are compared against active lost-item reports.

---

## 🤖 Automatic Match Engine

One of the main features of LostLink is its automatic matching system.

Instead of requiring users or administrators to manually compare every lost and found report, the application calculates a **match score** between lost and found items.

The matching algorithm considers:

| Attribute      |   Weight |
| -------------- | -------: |
| Category       |      20% |
| Item Title     |      20% |
| Description    |      20% |
| Brand          |      10% |
| Color          |      10% |
| Location       |      10% |
| Date Proximity |       5% |
| Unique Details |       5% |
| **Total**      | **100%** |

A potential match is created when the calculated score is **50% or higher**.

---

### 🧮 Match Calculation

The system compares multiple attributes of a lost item and a found item.

#### 1. Category

If both items belong to the same category, the category receives a full score.

Example:

```text
Lost Item: Electronics
Found Item: Electronics
```

This produces a category match.

---

#### 2. Title / Item Name

The application compares the titles of the lost and found items using a token-based string similarity method.

For example:

```text
Lost:  Black HP Laptop Charger
Found: Black HP 65W Charger
```

These titles have several common words, resulting in a higher similarity score.

---

#### 3. Description

The descriptions of both items are also compared.

For example:

```text
Lost:
Black HP laptop charger lost near Central Library.

Found:
Found black HP laptop charger near Central Library.
```

Because the descriptions contain similar information, the description similarity score becomes high.

---

#### 4. Brand

The system compares the brand names.

Example:

```text
Lost:  HP
Found: HP
```

This produces a strong brand match.

---

#### 5. Color

The color of the items is compared.

Example:

```text
Lost:  Black
Found: Black
```

The system considers this a strong match.

---

#### 6. Location

The system compares where the item was lost and found.

For example:

```text
Lost:  Central Library
Found: Central Library
```

This produces a strong location match.

The system can also identify partial similarities between location names.

---

#### 7. Date Proximity

The system compares the lost date and found date.

The closer the dates are, the higher the similarity.

The current rules are:

| Difference        | Score |
| ----------------- | ----: |
| 1 day or less     |  100% |
| 3 days or less    |   80% |
| 7 days or less    |   50% |
| 14 days or less   |   25% |
| More than 14 days |    0% |

---

#### 8. Unique Details

The system also compares unique identifying details.

For example:

```text
Lost:
Black electric tape on the charger wire.

Found:
Black tape on the charger wire.
```

Because these details are similar, the system increases the match score.

---

## 🔔 Notifications

When the matching engine identifies a potential match, LostLink creates notifications for both users.

The owner of the lost item receives a notification indicating that a potential found-item match has been identified.

The person who reported the found item receives a notification indicating that someone has reported a similar lost item.

This allows both parties to investigate the potential match.

---

## 🧾 Claims

LostLink includes a claim management system.

When a user believes that a found item belongs to them, they can submit a claim.

The claim system helps verify ownership before an item is returned.

Verification questions and answers can be associated with items to provide additional ownership verification.

---

## 📊 Dashboard

The application provides a dashboard where users can view relevant information about their lost and found reports.

Dashboard functionality includes information related to:

* Lost items
* Found items
* Matches
* Claims
* Notifications
* User activity

Administrators have access to additional dashboard functionality.

---

## 👨‍💼 Admin Functionality

LostLink supports role-based access.

There are two main user roles:

### Normal User

Normal users can:

* Register
* Login
* Report lost items
* Report found items
* Browse items
* View matches
* Submit claims
* View notifications
* Manage their profile

### Administrator

Administrators have additional access to administrative dashboard information and management functionality.

---

# 🏗️ System Architecture

LostLink follows a full-stack client-server architecture.

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      (Vite)         │
                    └──────────┬──────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Authentication    Match Engine      Claims
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    └─────────────────────┘
```

---

# 💻 Technology Stack

## Frontend

The frontend is developed using:

* React
* Vite
* React Router
* Axios
* JavaScript
* CSS

The frontend is located inside:

```text
client/
```

---

## Backend

The backend is developed using:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* Cloudinary
* CORS
* dotenv

The backend is located inside:

```text
server/
```

---

## Database

LostLink uses **MongoDB** as its database.

MongoDB stores information about:

* Users
* Lost items
* Found items
* Matches
* Claims
* Notifications

Mongoose is used as the Object Data Modeling (ODM) library for MongoDB.

---

# 📁 Project Structure

```text
project/
│
├── client/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── ItemCard.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── Toast.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── BrowsePage.jsx
│   │   │   ├── ClaimPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ItemDetailsPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MatchesPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ReportFoundPage.jsx
│   │   │   └── ReportLostPage.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   │
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── claimController.js
│   │   ├── itemController.js
│   │   ├── matchController.js
│   │   ├── notificationController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   │
│   ├── models/
│   │   ├── Claim.js
│   │   ├── FoundItem.js
│   │   ├── LostItem.js
│   │   ├── Match.js
│   │   ├── Notification.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── claimRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── matchRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── services/
│   │   └── matchEngine.js
│   │
│   ├── utils/
│   │   └── seedData.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── package.json
```

---

# 🔄 Application Workflow

The basic workflow of LostLink is:

```text
User Registration/Login
          │
          ▼
      User Dashboard
          │
     ┌────┴─────┐
     │          │
     ▼          ▼
 Report Lost   Report Found
     │          │
     └────┬─────┘
          │
          ▼
    Match Engine
          │
          ▼
 Calculate Similarity
          │
          ▼
 Match Score >= 50% ?
       /       \
     Yes        No
      │          │
      ▼          ▼
 Create Match   No Match
      │
      ▼
 Send Notifications
      │
      ▼
 User Reviews Match
      │
      ▼
 Submit Claim
      │
      ▼
 Verification / Resolution
```

---

# 🔐 Authentication and Authorization

The backend uses JWT-based authentication.

When a user successfully logs in:

1. The server verifies the user's credentials.
2. A JWT token is generated.
3. The client stores the authentication information.
4. The token is sent with protected API requests.
5. Backend middleware verifies the token.
6. The authenticated user's information is made available to the request.

Administrative routes additionally check whether the authenticated user has the administrator role.

---

# 🖼️ Image Uploads

The application supports image uploads for lost and found items and user profile images.

The backend contains:

```text
config/cloudinary.js
```

for Cloudinary configuration and:

```text
middleware/upload.js
```

for handling uploaded files.

Images can therefore be uploaded and stored using Cloudinary.

---

# 🌐 API Structure

The backend exposes REST API routes.

## Authentication

```text
/api/auth
```

Handles registration, login, and authentication-related operations.

---

## Lost and Found Items

```text
/api
```

Handles operations related to lost and found items.

---

## Matches

```text
/api/matches
```

Handles potential matches between lost and found items.

---

## Claims

```text
/api/claims
```

Handles item ownership claims.

---

## Notifications

```text
/api/notifications
```

Handles user notifications and notification status.

---

## Users

```text
/api/users
```

Handles:

```text
/api/users/profile
/api/users/dashboard
/api/users/admin/dashboard
```

and other user-related functionality.

---

# ⚙️ Installation

## Prerequisites

Make sure the following software is installed:

* Node.js
* npm
* MongoDB
* Git

You should also have a Cloudinary account if image upload functionality is required.

---

# 📥 Clone the Project

```bash
git clone <repository-url>
cd project
```

---

# 📦 Install Dependencies

Install the root dependencies if required:

```bash
npm install
```

Then install the frontend dependencies:

```bash
cd client
npm install
```

Then install the backend dependencies:

```bash
cd ../server
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

The project provides:

```text
server/.env.example
```

as a reference.

Typical environment variables include:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Do not commit actual passwords, API keys, database credentials, or other secrets to GitHub.

---

# ▶️ Running the Backend

Open a terminal:

```bash
cd server
npm install
npm start
```

The backend runs on:

```text
http://localhost:5000
```

The root API endpoint returns:

```json
{
  "message": "Welcome to LostLink API"
}
```

---

# ▶️ Running the Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Vite will start the React development server and provide a local URL, normally similar to:

```text
http://localhost:5173
```

Open the displayed URL in a web browser.

---

# 🌱 Demo Database Seeding

The project contains a seed utility:

```text
server/utils/seedData.js
```

The seed script creates demo users, lost items, found items, and automatically runs the matching engine.

The demo data contains:

### Demo User

```text
Email: chaitanya@lostlink.com
Password: password123
```

### Demo User

```text
Email: john@lostlink.com
Password: password123
```

### Demo Administrator

```text
Email: admin@lostlink.com
Password: adminpassword
```

The seed data includes example items such as:

* Black HP laptop charger
* Blue Samsung phone
* Brown leather wallet
* Student ID card
* AirPods case
* College backpack

The seeded lost and found items are intentionally designed to produce meaningful potential matches.

---

# 🧪 Example Matching Scenario

Consider the following two reports.

### Lost Item

```text
Title: Black HP Laptop Charger
Category: Electronics
Color: Black
Brand: HP
Location: Central Library
```

### Found Item

```text
Title: Black HP 65W Charger
Category: Electronics
Color: Black
Brand: HP
Location: Central Library
```

The matching engine identifies similarities in:

* Category
* Title
* Description
* Brand
* Color
* Location
* Date
* Unique details

The resulting score can exceed the 50% matching threshold.

The system then creates a match and sends notifications to the relevant users.

---

# 📈 Match Result

Each match contains:

```text
Overall Match Score
Category Score
Title Score
Description Score
Brand Score
Color Score
Location Score
Date Score
Unique Details Score
Match Reasons
```

This makes the matching system more transparent because users can understand why two items were considered similar.

---

# 🛡️ Security Considerations

The application includes several security mechanisms:

* Password hashing using bcrypt.
* JWT-based authentication.
* Protected API routes.
* Role-based authorization.
* Authentication middleware.
* Environment variables for sensitive configuration.
* Validation of authenticated users before accessing protected resources.

For production deployment, additional security improvements should be considered, including:

* Restricting CORS origins.
* Using HTTPS.
* Stronger password policies.
* Rate limiting.
* Input validation and sanitization.
* Secure cookie/token configuration.
* Proper production error handling.
* Protection of uploaded files.

---

# 🚀 Future Enhancements

The LostLink system can be extended with additional features such as:

* AI-based image similarity.
* Computer vision for identifying similar objects.
* Semantic similarity using NLP/embeddings.
* Email notifications.
* Push notifications.
* Real-time notifications using WebSockets.
* Advanced search and filtering.
* Location/map integration.
* QR-code-based item identification.
* Admin moderation.
* Claim approval and rejection workflow.
* Item handover tracking.
* Automatic duplicate detection.
* Mobile application support.
* Analytics and reporting.
* Improved fraud prevention and ownership verification.

---

# 🎯 Project Objectives

The major objectives of LostLink are:

1. To create a centralized platform for lost and found item management.
2. To simplify reporting of lost and found belongings.
3. To reduce the time required to identify potential matches.
4. To automatically compare lost and found reports.
5. To provide users with meaningful match scores.
6. To notify users about potential matches.
7. To provide an ownership verification mechanism.
8. To improve the overall efficiency of campus lost-and-found management.

---

# 📚 Main Modules

The project can be divided into the following major modules:

### 1. Authentication Module

Handles:

* Registration
* Login
* JWT authentication
* Role-based authorization

### 2. Lost Item Module

Handles:

* Creating lost reports
* Viewing lost items
* Updating lost items
* Managing lost-item information

### 3. Found Item Module

Handles:

* Creating found reports
* Viewing found items
* Updating found items
* Managing found-item information

### 4. Matching Module

Handles:

* Comparing lost and found items
* Calculating similarity
* Generating match scores
* Creating potential matches

### 5. Notification Module

Handles:

* Match notifications
* Notification listing
* Marking notifications as read

### 6. Claim Module

Handles:

* Ownership claims
* Verification
* Claim processing

### 7. User Module

Handles:

* User profiles
* User dashboard
* Profile updates
* User statistics

### 8. Admin Module

Handles:

* Administrative dashboard
* Administrative access control
* System-level monitoring

---

# 🧑‍💻 Development

The frontend uses React with Vite for fast development and hot module replacement.

The backend uses Express.js to expose REST APIs.

The application communicates using HTTP requests between the React frontend and Express backend.

```text
React UI
   │
   │ Axios / HTTP
   ▼
Express REST API
   │
   ▼
Controllers
   │
   ▼
Mongoose Models
   │
   ▼
MongoDB
```

---

# 📝 Conclusion

LostLink is a full-stack lost-and-found management platform that combines a modern web interface with automated item matching.

Instead of relying completely on manual searching, the system analyzes important item characteristics such as category, title, description, brand, color, location, date, and unique details.

By combining these factors into a weighted match score, LostLink can identify potential relationships between lost and found reports and notify the corresponding users.

The project demonstrates the integration of:

* React
* Vite
* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT authentication
* Cloudinary
* REST APIs
* Automated similarity matching
* Notifications
* Claims and verification
* Role-based authorization

LostLink can serve as a foundation for a real-world digital lost-and-found platform for colleges, universities, offices, and other organizations.
