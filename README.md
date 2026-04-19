# Barkat

## Overview
Barkat is an e-commerce marketplace where users can buy groceries and fresh produce from multiple sellers, while also sharing and discovering community recipes. It connects shopping with cooking by linking recipes to the products needed for them. Sellers manage their own stores, admins oversee the platform, and users can browse, order, and contribute recipes.

## Features
- **Product Marketplace**: Browse products by category, add to cart, and checkout with cash on delivery or online payments.
- **Seller Management**: Sellers apply to join, get approved by admins, and manage their product listings and orders.
- **Community Recipes**: Users submit recipes with ingredients, steps, and photos; admins review and approve them.
- **Reviews and Ratings**: Rate products and recipes, with helpful voting on reviews.
- **Order Tracking**: View order history and status updates.
- **Multi-Role Access**: Separate dashboards for users, sellers, and admins.

## Tech Stack
- **Backend**: Node.js with Express, MongoDB for database, JWT for authentication, Cloudinary for image uploads, Razorpay for payments.
- **Frontend**: React with Vite, Axios for API calls, React Router for navigation.
- **Other**: Multer for file handling, bcrypt for password hashing.

## How It Works
Users sign up and browse products from approved sellers. They can add items to a cart, place orders, and track delivery. Sellers list products and handle their orders. Anyone can submit recipes, which get moderated before going live. Recipes can link to products, making it easy to shop for ingredients. Admins approve sellers and recipes, and manage the overall platform.

## Installation
1. Clone the repository.
2. Set up the backend:
   - Go to the `backend` folder.
   - Run `npm install` to install dependencies.
   - Create a `.env` file with your MongoDB connection string, JWT secret, Cloudinary credentials, and Razorpay keys.
   - Run `npm start` to start the server (usually on port 5000).
3. Set up the frontend:
   - Go to the `frontend` folder.
   - Run `npm install`.
   - Run `npm run dev` to start the development server (usually on port 5173).
4. Make sure MongoDB is running locally or use a cloud instance.

## Usage
- Open the frontend in your browser.
- Register as a user, seller, or admin.
- Browse products, add to cart, and place orders.
- Submit recipes from the community section.
- Sellers can log in to manage products and orders.
- Admins can approve pending sellers and recipes.

## Project Structure
- `backend/`: Server-side code with models, controllers, routes, and middleware.
- `frontend/src/components/`: Reusable UI components like ProductCard and Navbar.
- `frontend/src/pages/`: Main pages like Home, Basket, and admin/seller dashboards.
- `frontend/src/context/`: Global state management for user data and recipes.
- `uploads/`: Folder for temporary file uploads (handled by Multer).

## Future Improvements
- Add inventory tracking to prevent overselling.
- Allow order cancellations and refunds.
- Add email notifications for orders and approvals.
- Improve recipe features with scaling and difficulty levels.

## Notes
- Authentication uses JWT tokens stored in cookies.
- Set up environment variables for sensitive data like API keys.
- The platform assumes a MongoDB database; adjust the connection string as needed.
- Recipe submissions require admin approval to maintain quality.