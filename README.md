# 📰 Northcoders News API

A RESTful backend API for a Reddit-style news site. Built with **Node.js**, **Express**, and **PostgreSQL**, it allows users to fetch, create, update, and delete articles, topics, comments, and users — with full pagination, sorting, filtering, and robust error handling.

This project was built as part of the **Northcoders Bootcamp Course** to demonstrate skills in backend development, RESTful architecture, and test-driven development.

<br/>

## 🚀 Live Demo

👉 [Access the Live API on Render](https://nc-news-qonp.onrender.com/api)

Use `/api` to view all available endpoints.

<br/>

## 📋 Features

- 📰 View articles, topics, users, and comments
- 🔍 Filter and sort articles by query (`sort_by`, `order`, `topic`)
- 📄 Pagination support via `limit` and `p`
- ✍️ Post new articles, topics, and comments
- ⬆️ Update votes on articles and comments
- 🗑 Delete comments and articles
- 🚫 Full error handling for:
  - Invalid or missing parameters
  - Non-existent routes or resources
  - SQL and data validation errors

<br/>

## 🛠️ Tech Stack

- **Node.js**
- **Express**
- **PostgreSQL**
- **Jest** & **Supertest** (for TDD)
- **pg** & **pg-format**
- **dotenv**

<br/>

## 📦 Architecture

- **MVC pattern** (Models, Controllers, Routers)
- Centralized error handling
- Environment-specific configuration using `.env` files
- Separate databases for development and test environments

<br/>

## 📂 Database Schema

Picture to add later

The database includes tables for users, topics, articles, and comments with appropriate foreign key relationships and cascading deletes where applicable.

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

