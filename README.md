# QuickServe — Service Booking Frontend

React + Vite frontend for the Service Booking System.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

For Windows, create `.env` manually with:

```text
VITE_API_URL=http://localhost:8080/api
```

The frontend expects the Spring Boot backend at `http://localhost:8080`.

## Production build

```bash
npm run build
npm run preview
```

For deployment on Vercel/Netlify, set the environment variable:

```text
VITE_API_URL=https://YOUR-BACKEND-URL/api
```
