# Stock Market Management System

A full-stack web application for managing stock market activity — register, log in, view stock prices, buy and sell stocks, track your portfolio, and review transaction history.

**Live app:** https://stock-market-management-system-wswg.vercel.app

## Tech Stack

**Frontend**
- React (Vite)
- Axios for API requests
- Deployed on [Vercel](https://vercel.com)

**Backend**
- Java / Spring Boot
- Spring Security (JWT-based authentication)
- Deployed on [Railway](https://railway.app)

**Database**
- MySQL (hosted on Railway)

## Features

- User registration and login (JWT authentication)
- View live/simulated stock prices
- Buy and sell stocks
- Portfolio management
- Transaction history
- Market trend analysis

## Project Structure

```
StockMarket/
├── stock-market-frontend/     # React + Vite frontend
│   ├── src/
│   │   ├── services/api.js    # Axios instance, API base URL config
│   │   └── ...
│   ├── .env.production        # VITE_API_URL for production build
│   └── vercel.json            # Vercel routing config (React Router support)
│
└── stock-market-backend/      # Spring Boot backend
    └── src/main/java/com/stockmarket/
        ├── config/CorsConfig.java   # CORS configuration
        └── ...
```

## Environment Variables

**Frontend** (`stock-market-frontend/.env.production`)
```
VITE_API_URL=https://stock-market-management-system-production.up.railway.app
```

**Backend** — configured via Railway environment variables (database connection, JWT secret, etc.)

## Local Development

**Frontend**
```bash
cd stock-market-frontend
npm install
npm run dev
```

**Backend**
```bash
cd stock-market-backend
./mvnw spring-boot:run
```

## Deployment

- **Frontend** deploys automatically to Vercel on every push to `main` (root directory: `stock-market-frontend`)
- **Backend** deploys automatically to Railway on every push to `main`
- CORS is configured in `CorsConfig.java` to allow requests from the production Vercel domain

## Demo Login

```
Username: demo_user
Password: password123
```

## License

This project is for educational/portfolio purposes.
