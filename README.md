# Spreadsheet Web Application

## 📌 Overview
This is a web-based spreadsheet application that mimics Google Sheets. It allows users to perform basic spreadsheet operations like data entry, find & replace, duplicate removal, and mathematical calculations (**Sum, Average, Min, Max, Count**). The data can be saved and loaded using MongoDB.

## 🚀 Features
- **Dynamic Spreadsheet**: Automatically adjusts the number of columns based on screen size.
- **Find and Replace**: Replace occurrences of a specific text within the spreadsheet.
- **Remove Duplicates**: Clears duplicate values from the spreadsheet.
- **Mathematical Operations**: Supports **Sum, Average, Min, Max, and Count** for selected cells.
- **Data Persistence**: Save and load spreadsheets using MongoDB.
- **Drag and Select**: Select a range of cells by dragging.

- ## 🛠️ Tech Stack
- **Node.js** (Backend API)
- **Express.js** (Server framework)
- **MongoDB & Mongoose** (Database & ORM)
- **dotenv** (Environment variable management)
- **CORS** (Cross-origin requests handling)

## ⚙️ Installation & Setup

### **Prerequisites**
Ensure you have the following installed:
- **Node.js** and **npm** (for backend server)
- **MongoDB** (for database storage)


1️⃣ **Start the Backend Server**  
   - Run the backend:
     ```sh
     node server.js
     ```

2️⃣ **Open the Application**  
   - Open `index.html` in your browser.

3️⃣ **Using the Spreadsheet**  
   - **Entering Data**: Click any cell and type your data.  
   - **Selecting Cells**: Click and drag to select multiple cells.  
   - **Performing Calculations**:  
     - Select the required cells.  
     - Click the **Sum, Average, Min, Max, or Count** button.  
     - The result will be displayed in an alert.  
   - **Saving and Loading Data**:  
     - Click **Save** to store the spreadsheet in MongoDB.  
     - Click **Load** to retrieve the saved spreadsheet.  


