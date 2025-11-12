# 🗂️ Project Management Tool (Trello Clone)

A **modern, real-time, and professional Trello-style Project Management Web App** built with the **MERN stack** — empowering teams to plan, organize, and collaborate efficiently.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 🚀 Overview

This app is a **Trello-inspired project planner** featuring **drag-and-drop boards**, **real-time collaboration**, and a **clean, professional UI**.  
Built for productivity, collaboration, and smooth task flow.

### ✨ Key Highlights

- Real-time updates using **Socket.IO**
- Task drag-and-drop via **React Beautiful DnD**
- JWT-based authentication system
- Board-specific chat with user presence
- Built-in demo data for instant preview
- Elegant UI with **Tailwind CSS** and smooth animations

---

## 🧩 Core Features

### 🔐 Authentication

- Secure **JWT login/signup**
- Protected routes & dashboard access

### 🧭 Boards Management

- Create, edit, and delete boards  
- Each board contains multiple task columns (To Do, In Progress, Done)

### 📋 Task Management

- CRUD operations for tasks  
- Assign members, add descriptions, due dates & attachments  
- Optional checklists for better organization

### 🪄 Drag & Drop

- Built using **React Beautiful DnD**
- Drag tasks between columns  
- Automatic status update and database persistence

### 💬 Real-Time Collaboration

- Real-time task updates using **Socket.IO**
- Integrated board-level chat system  
- User presence indicators for live teamwork

### 🔍 Search & Filter

- Quickly find tasks by title, status, or due date

### 🌈 UI & UX

- Designed with **Tailwind CSS** for a modern and minimal look  
- Professional color palette and soft animations  
- Includes a custom **professional logo**  
- Pre-filled demo data to explore right after deployment

---

## 🧰 Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | React, Tailwind CSS, React Beautiful DnD |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Realtime | Socket.IO |
| Auth | JSON Web Tokens (JWT) |
| Deployment | Vercel (frontend) + Render / Atlas (backend) |

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/project-management-tool.git
   cd project-management-tool
npm install
cd client && npm install
npm run dev
