# Portfolio Admin Dashboard — Week 2 (Full Stack MERN)

## 📁 Project Structure

```
portfolio-dashboard/
├── backend/          ← Node.js + Express + MongoDB API
│   ├── models/       ← Mongoose schemas (User, Profile, Skill, Project)
│   ├── routes/       ← API routes (auth, profile, skills, projects, dashboard)
│   ├── middleware/   ← JWT auth middleware
│   ├── server.js     ← Entry point
│   └── .env          ← Environment variables
│
└── frontend/         ← React.js Dashboard
    └── src/
        ├── api/      ← All API calls in one place
        ├── context/  ← Auth context (global state)
        ├── components/layout/ ← Sidebar, Header, DashboardLayout
        └── pages/    ← Dashboard, Projects, Skills, Profile
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or MongoDB Atlas)

---

### Step 1 — Backend Setup

```bash
cd backend
npm install
```

Edit `.env` and set your values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio_db
JWT_SECRET=your_super_secret_key
```

Start the backend:
```bash
npm run dev
```
Backend runs at: **http://localhost:5000**

---

### Step 2 — Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get token |

### Profile (🔒 Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/profile | Get my profile |
| PUT | /api/profile | Update profile info |
| POST | /api/profile/image | Upload profile picture |

### Skills (🔒 Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/skills | Get all skills |
| POST | /api/skills | Add a skill |
| PUT | /api/skills/:id | Update a skill |
| DELETE | /api/skills/:id | Delete a skill |

### Projects (🔒 Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Get all (with search & filter) |
| GET | /api/projects/:id | Get single project |
| POST | /api/projects | Create project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |

**Query Params for GET /api/projects:**
- `search=react` — search by name/tech/description
- `category=Web Development` — filter by category
- `status=Completed` — filter by status

### Dashboard (🔒 Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard/stats | All analytics stats |

---

## ✅ Features Implemented

- [x] **Dashboard** — Stats cards (Total Projects, Skills, Completed, In Progress)
- [x] **Charts** — Pie chart (projects by category), Bar chart (skills by category)
- [x] **Recent Projects** table on dashboard
- [x] **Projects Management** — Add, Edit, Delete, search by name/tech, filter by category/status
- [x] **Skills Management** — Add, Edit, Delete, grouped by category with progress bars
- [x] **Profile Management** — Personal info, bio, contact, social links, profile image upload
- [x] **Authentication** — JWT login/register with protected routes
- [x] **Responsive** — Works on mobile, tablet, and desktop
- [x] **Dark Theme** — Professional dark UI throughout

---

## 🛠 Technologies Used

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, bcryptjs

**Frontend:** React.js, React Router v6, Axios, Recharts, React Hot Toast, Lucide React
