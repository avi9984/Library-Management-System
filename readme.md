# Library Management System API

A RESTful API for managing a library system, built with Node.js, Express, and MongoDB. The API provides functionalities to manage books, users, and borrow/return operations with JWT-based authentication.

## Features

- **Books**: Add, retrieve, update, and delete books.
- **Users**: Register, retrieve, update, and delete users.
- **Borrowing**: Borrow and return books.
- **Authentication**: JWT-based authentication to secure certain endpoints.
- **Password Hashing**: Secure password storage using bcrypt.
- **Pagination**: Paginated results for large lists (e.g., books, users).

## Technologies

- **Node.js** with **Express** framework for backend development.
- **MongoDB** for NoSQL database storage.
- **Mongoose** for database modeling and querying.
- **JWT (JSON Web Token)** for securing endpoints.
- **bcrypt** for hashing passwords.

## API Endpoints

### Books

- **POST /books**: Add a new book. (Requires authentication)
- **GET /books**: Retrieve a list of all books (supports pagination and filtering by author, genre, or publish year).
- **GET /books/:id**: Get details of a specific book by its ID.
- **PUT /books/:id**: Update the details of an existing book. (Requires authentication)
- **DELETE /books/:id**: Remove a book from the system. (Requires authentication)

### Users

- **POST /users**: Register a new user.
- **GET /users**: List all registered users (supports pagination).
- **GET /users/:id**: Get user details by ID. (Requires authentication)
- **PUT /users/:id**: Update user details. (Requires authentication)
- **DELETE /users/:id**: Remove a user from the system. (Requires authentication)

### Borrowing

- **POST /borrow**: Borrow a book (fields: `userId`, `bookId`, `borrowDate`). (Requires authentication)
- **GET /borrow**: Get a list of all borrowed books (includes user and book details).
- **POST /return**: Return a borrowed book (fields: `userId`, `bookId`, `returnDate`). (Requires authentication)

## Authentication

The API uses JWT-based authentication for protecting certain routes. When users log in, they receive a token, which must be included in the `Authorization` header of protected requests.

### Example Authorization Header


## Installation

### Prerequisites

- Node.js (version 14.x or higher)
- MongoDB (running locally or using a cloud provider like MongoDB Atlas)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/library-management-system.git
2. Navigate to the project directory:
    ```
    cd library-management-system

3. Install dependencies:
    ```
    npm install
4. Create a .env file in the root directory and add the following environment variables:
    ```
    PORT=3000
    MONGO_URL="mongodb+srv://Avi9984:JM6hnTiQIRViVdA3@cluster0.qfc4n.mongodb.net/lms-system"

    SECRET_KEY="ce5fa5bbe05df2e8df4c89aa64a3a7b2039caa75cdc0c1efd1697d1844db8f7be6d1c184f45602dd4e4993e7d9a6794548ef4f27e4f2251d6387df53a7de3c01bd3b93a21c6d"
5. Start the server:
    ```
    npm start
    