🛍️ Product Management System
A simple web-based Product Management System built with HTML, CSS, TypeScript, and Bootstrap. It allows users to add, edit, delete, filter, and sort products, with data stored in localStorage for persistence.

🔧 Features
Product Fields
Product ID (Auto-generated)

Product Name

Product Image

Price

Description

Core Functions
Add Product – Form with real-time validation and TypeScript enforcement

Edit Product – Update product details using query parameters

Delete Product – Includes a confirmation modal and success feedback

View Products – Displayed as responsive cards with clean Bootstrap layout

Filter Products – By ID, Name, Description, or Price

Sort Products – By ID, Name, or Price in ascending/descending order

Persistent Storage – All data is saved in localStorage

Responsive UI – Built with Bootstrap 4

Dynamic Filter Feedback – Displays specific messages like “No products found for Product ID ‘17427230’.” when filters return no results

Image Size Restriction – Image uploads are limited to 1MB, with a clear alert: “Image file size should not exceed 1MB.”

✅ Validation Rules
Field Rules
Name Required, minimum 2 characters
Image Upload Required for new products, JPG/PNG only, max 1MB
Price Must be a number greater than 0
Description Required, minimum 10 characters
Real-Time Fields validate instantly as the user types
📦 How to Use
Click "Add Product" to create a new entry.

Use the Edit button to update product info via query parameters.

Click Delete to remove a product (with confirmation modal).

Use Filter inputs to search for products by criteria.

Use Sort dropdowns to sort products by ID, name, or price.

When no results match the filters, a specific message is displayed.

All product data is saved in localStorage and persists across sessions.

📁 Modular TypeScript Structure
All business logic is written in TypeScript and modularized inside the src/ folder for better maintainability:

File Purpose
types.ts Shared TypeScript type definitions (e.g., Product interface)
storage.ts Handles loading and saving products from localStorage
modal.ts Displays success confirmation popups using Bootstrap modals
product-form.ts Manages form input, validation, and saving new or edited products
product-list.ts Renders product cards, applies filters/sorting, and handles deletions
Each module is responsible for a distinct feature, ensuring clean separation of concerns and type safety throughout the app.

💡 Tech Stack
HTML5

CSS3

TypeScript

Bootstrap 4

DOM APIs

LocalStorage API
