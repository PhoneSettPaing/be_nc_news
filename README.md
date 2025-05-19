# 📰 Northcoders News API

A RESTful backend API for a Reddit-style news site. Built using **Node.js**, **Express**, and **PostgreSQL**, the API allows users to interact with articles, topics, comments, and users.

This project was built as part of the **Northcoders Bootcamp Course** to demonstrate skills in backend architecture, RESTful routing, SQL data and error handling, and test-driven development.

<br/>

## 🚀 Live Demo

👉 [Live API on Render](https://nc-news-qonp.onrender.com)

<br/>

## 📋 Summary

This API provides full CRUD functionality for Northcoders News platform, allowing clients to interact with articles, topics, comments, and users. It includes:
- 📚 Retrieving all articles, topics, users, and comments
- 🔍 Filtering, sorting, and paginating articles via query parameters (sort_by, order, topic, limit, p)
- 📝 Creating new articles, topics, and comments
- 🔺 Updating vote counts on articles and comments
- ❌ Deleting individual comments and articles
- 🚫 Graceful error handling for:
    - Invalid or non-existent IDs
    - Malformed requests
    - Missing required fields
    - Unsupported routes (404)

<br/>

## 🛠️ Tech Stack

- **Node.js**
- **Express**
- **PostgreSQL**
- **Jest** & **Supertest** (for TDD)
- **pg** & **pg-format**
- **dotenv**

<br/>

## 📦 Features

- View all topics, articles, users, and comments
- Filter and sort articles by query
- Post new comments and articles
- Update votes on articles/comments
- Delete comments
- Full error handling for common HTTP errors
- Modular MVC architecture
- Environment-specific configuration using `.env` files

<br/>

## 📂 Database Schema

Picture to add later

<br/>

## ✅ Getting Started

### 🔧 Prerequisites

- **Node.js**: v20.11.1 or higher  
- **PostgreSQL**: v15 or higher

### 🛠 Installation

1. Clone the repo:
```bash
git clone https://github.com/yourusername/be-nc-news.git
cd be-nc-news
Install dependencies:

npm install
Set up environment variables:

Create two .env files:

.env.development
.env.test
Inside each, add:

PGDATABASE=your_db_name
Set up and seed the databases:

npm run setup-dbs
npm run seed-dev
Run the app:

npm start
🧪 Running Tests
npm test
Runs all test suites using Jest and Supertest, covering endpoints and error handling.

📖 API Endpoints
Example: GET /api/articles

Returns a list of articles with optional filters like sort_by, order, and topic.

You can find full endpoint documentation in the /endpoints.json file or at /api once deployed.

