
# Personal Expense Tracker

A full-stack web application that helps users manage their personal finances by tracking income, expenses, monthly budgets, and spending patterns.

## Features

- User Registration and Login
- Dashboard with Income, Expense and Balance Summary
- Add, Edit and Delete Transactions
- Transaction History with Search and Filters
- Category-wise Expense Analysis
- Monthly Expense Reports and Charts
- Monthly Budget Management
- Budget Usage and Remaining Balance
- CSV Export
- Responsive User Interface

## Technology Stack

**Frontend**
- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- Recharts

**Backend**
- Python
- Django
- Django REST Framework

**Database**
- MariaDB / MySQL

## Project Architecture

React Frontend → REST API → Django Backend → MariaDB Database

## Project Structure

PERSONAL-EXPENSE-TRACKER/
- backend/
- frontend/
- .gitignore
- README.md

## Installation and Setup

### 1. Clone the repository

git clone YOUR_GITHUB_REPOSITORY_URL

### 2. Backend Setup

cd backend

python -m venv venv

venv\Scripts\activate

Install the required Python packages from requirements.txt.

Configure your database credentials in the backend .env file.

Run migrations:

python manage.py migrate

Start the backend:

python manage.py runserver

### 3. Frontend Setup

Open another terminal:

cd frontend

npm install

npm run dev

## Application

Frontend: http://localhost:5173/

Backend: http://127.0.0.1:8000/

## Future Enhancements

- PDF Report Generation
- Advanced Financial Analytics
- Recurring Transactions
- Cloud Deployment

## Author

Manoj SV
