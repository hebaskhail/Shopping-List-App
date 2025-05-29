# Shopping List API

A RESTful API for managing products and shopping lists. This application allows users to manage products, create shopping lists, and track product quantities.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Products](#products)
  - [Shopping List](#shopping-list)
- [Error Handling](#error-handling)

## Features

- User Authentication 
- Product Management (CRUD operations)
- Shopping List Management
- Real-time price updates
- Quantity tracking
- Input validation
- Consistent error handling

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <https://github.com/hebaskhail/Shopping-List-App.git>
cd Shopping-List-App
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Documentation

All responses follow this structure:
```json
{
    "success": true|false,
    "statusCode": 200,
    "message": "Success/Error message",
    "data": {} | null
}
```

### Authentication

#### Login

Authenticate as user.

**Request Body:**
```json
{
    "email": "test@gmail.com",
    "password": "testPassword"
}
```

**Success Response:**
```json
{
    "success": true,
    "statusCode": 200,
    "data": {
        "token": "jwt-token-here"
    }
}
```

### Products

All product endpoints (except GET) require authentication. Include the JWT token in the Authorization header:

#### Get All Products
```
GET /api/product
```

**Success Response:**
```json
{
    "success": true,
    "statusCode": 200,
    "message": "Success",
    "data": [
        {
            "id": 1,
            "name": "Product Name",
            "quantity": 100,
            "price": 9.99
        }
    ]
}
```

#### Get Single Product
```
GET /api/product/:id
```

**Parameters:**
- `id`: Product ID (number)

#### Add Product
```
POST /api/product
```

**Request Body:**
```json
{
    "name": "Product Name",
    "quantity": 100,
    "price": 9.99
}
```

#### Update Product
```
PUT /api/product/:id
```

**Parameters:**
- `id`: Product ID (number)

**Request Body:**
```json
{
    "name": "Updated Name",
    "quantity": 50,
    "price": 19.99
}
```
All fields are optional. Only provided fields will be updated.

#### Delete Product
```
DELETE /api/product/:id
```

**Parameters:**
- `id`: Product ID (number)

### Shopping List

All shopping list endpoints require authentication.

#### Get Shopping List
```
GET /api/v1/shopping-list
```

**Success Response:**
```json
{
    "success": true,
    "statusCode": 200,
    "message": "Shopping list retrieved successfully",
    "data": {
        "items": [
            {
                "productId": 1,
                "productName": "Product Name",
                "quantity": 2,
                "price": 9.99,
                "subtotal": 19.98
            }
        ],
        "total": 19.98,
        "lastUpdated": "2024-03-20T12:00:00.000Z"
    }
}
```

#### Add to Shopping List
```
POST /api/v1/shopping-list/add
```

**Request Body:**
```json
{
    "productId": 1,
    "quantity": 2
}
```

#### Remove from Shopping List
```
POST /api/v1/shopping-list/remove
```

**Request Body:**
```json
{
    "productId": 1
}
```

## Error Handling

The API uses standard HTTP status codes and returns detailed error messages:

- `200`: Success
- `201`: Created
- `400`: Bad Request (invalid input)
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

Error Response Example:
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Invalid input provided",
    "data": null
}
```

 


## Business Rules

1. Products:
   - Product IDs are unique
   - Prices must be positive numbers
   - Quantities must be non-negative integers

2. Shopping List:
   - Can't add more items than available quantity
   - Prices in shopping list update when product prices change
   - Items are automatically removed if product is deleted
   - Total is automatically recalculated on any change

## Development

The application uses in-memory storage for simplicity. Data will be reset when the server restarts.

Default user credentials:
- Username: `user@shopping.com`
- Password: `admin123`

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```



