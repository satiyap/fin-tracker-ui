
# Fin-Tracker UI

A React-based user interface for the Fin-Tracker personal finance application.

## Features

- Dashboard with financial overview
- Account management
- Transaction tracking
- Scheduled transactions
- Investment tracking
- Category management
- Responsive design based on Material Design principles

## Technology Stack

- React 18
- React Router 6
- Bootstrap 5
- Chart.js
- Formik & Yup for form validation
- Axios for API requests
- React-Toastify for notifications
- FontAwesome icons

## Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sprasath/fin-tracker-ui.git
cd fin-tracker-ui
```

1. Install dependencies:
```bash
npm install
```

1. Create a `.env` file in the root directory with the following content:
```
REACT_APP_API_URL=http://localhost:8080/api/v1
```

## Running the Application

To start the development server:

```bash
npm start
```

The application will be available at http://localhost:3000

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be created in the `build` directory.

## Project Structure

- `src/api`: API integration functions
- `src/components`: React components organized by feature
- `src/context`: React context providers
- `src/hooks`: Custom React hooks
- `src/pages`: Page components that use smaller components
- `src/utils`: Utility functions

## Key Features

### Authentication

- User registration
- Login with JWT authentication
- Protected routes

### Dashboard

- Account balance overview
- Recent transactions
- Expense analysis charts
- Upcoming scheduled payments

### Transactions

- Add, edit, and delete transactions
- Filter transactions by date, type, amount
- Categorize transactions

### Accounts

- Manage multiple accounts
- Track account balances
- View account-specific transactions

### Scheduled Transactions

- Set up recurring transactions
- Get alerts for upcoming payments
- Execute scheduled transactions

### Investments

- Track investment performance
- Monitor SIPs and other investments
- View return rates

## License

This project is licensed under the MIT License - see the LICENSE file for details.