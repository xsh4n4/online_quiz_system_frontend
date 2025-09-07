# 📝 Online Quiz System (MERN Stack)

An online quiz application built with the **MERN stack (MongoDB, Express, React, Node.js)**.  
Users can register, take quizzes, view results, and compete on leaderboards.  
Admins can manage quizzes, view results, and control the platform.

---

## 🚀 Features
- 🔑 User authentication with JWT  
- 👤 User profile management  
- 📝 Take quizzes with multiple questions  
- 📊 Leaderboard for top performers  
- 🎓 Quiz results with detailed feedback  
- 🛠️ Admin panel to create, edit, and manage quizzes  
- 🌐 RESTful API with Express.js  
- 📱 Responsive frontend with React  

---

## 📂 Project Structure
online_quiz_system/
│── client/ # React frontend
│ ├── public/ # Public assets (index.html, favicon, etc.)
│ ├── src/ # Main source code
│ │ ├── components/ # UI components
│ │ │ ├── Navbar.jsx
│ │ │ ├── LoadingSpinner.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Profile.jsx
│ │ │ ├── Leaderboard.jsx
│ │ │ ├── QuizList.jsx
│ │ │ ├── QuizDetail.jsx
│ │ │ ├── TakeQuiz.jsx
│ │ │ ├── QuizResult.jsx
│ │ │ ├── AdminDashboard.jsx
│ │ │ ├── AdminQuizzes.jsx
│ │ │ ├── CreateQuiz.jsx
│ │ │ ├── EditQuiz.jsx
│ │ │ ├── AdminResults.jsx
│ │ │ └── Auth/
│ │ │ ├── Login.jsx
│ │ │ └── Register.jsx
│ │ ├── context/
│ │ │ └── AuthContext.jsx
│ │ ├── utils/
│ │ │ └── api.js
│ │ ├── App.jsx
│ │ ├── App.css
│ │ └── index.js
│ └── package.json
│
│── server/ # Express backend
│ ├── models/ # Mongoose models
│ │ ├── User.js
│ │ ├── Quiz.js
│ │ └── Result.js
│ ├── routes/ # API routes
│ │ ├── auth.js
│ │ ├── quizzes.js
│ │ ├── results.js
│ │ └── leaderboard.js
│ ├── data/ # Mock/sample data
│ │ ├── quizzes-mock.js
│ │ └── mockData.js
│ ├── server.js # Entry point for backend
│ ├── .env # Environment variables
│ └── package.json
│
│── README.md
│── todo.md

yaml
Copy code

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/online-quiz-system.git
cd online-quiz-system
2️⃣ Setup Backend (server)
bash
Copy code
cd server
npm install
Create a .env file inside server/ with:

ini
Copy code
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
Start backend:

bash
Copy code
npm start
3️⃣ Setup Frontend (client)
bash
Copy code
cd ../client
npm install
npm start
Frontend runs on http://localhost:3000
Backend runs on http://localhost:5000

🛠️ Tech Stack
Frontend: React.js, Context API

Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Authentication: JWT (JSON Web Tokens)

Styling: CSS

📌 Future Enhancements
⏱️ Quiz timer functionality

📸 Support for images & media in questions

🎨 Improved UI with Tailwind or Material UI

👥 Role-based access (Users vs Admins)

📊 Analytics dashboard for admins
