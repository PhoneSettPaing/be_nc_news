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

- **Node.js**: v23.9.0 or higher  
- **PostgreSQL**: v15 or higher

### 🛠 Installation & Setup

1. **Clone this repository**
   ```bash
   git clone https://github.com/PhoneSettPaing/be_nc_news.git
   cd be-nc-news
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create two `.env` files in the root directory:

   For development:  **`.env.development`**
   ```
   PGDATABASE=nc_news
   ```

   For testing:  **`.env.test`**
   ```
   PGDATABASE=nc_news_test
   ```

4. **Create and seed your databases**
   ```bash
   npm run setup-dbs
   npm run seed-dev
   ```

5. **Start the server locally**
   ```bash
   npm start
   ```

<br/>

## 🧪 Running Tests

Run all test suites using Jest and Supertest:

```bash
npm test
```

Tests include:
- ✅ Successful endpoints
- ❌ Error handling (invalid input, bad routes, PSQL violations, etc.)

<br/>

## 📖 API Documentation

Once deployed or running locally, navigate to:

```
GET /api
```

This returns a full JSON object documenting all available endpoints, queries, and example responses.

Alternatively, refer to the included [`endpoints.json`](./endpoints.json) file.


