# Website Deployment

This project is now prepared to run as a real website.

## Frontend Website on GitHub Pages

The repository includes a GitHub Actions workflow at:

```text
.github/workflows/deploy-github-pages.yml
```

To enable the live frontend:

1. Open the GitHub repository.
2. Go to **Settings > Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` or run the workflow manually.

The frontend website will publish at:

```text
https://skbitservice.github.io/JOBPORTEL/
```

## Backend API

GitHub Pages can host the React website, but it cannot run Node.js, Express, MongoDB, Multer uploads, or Nodemailer.

Deploy the `server` folder to a Node.js hosting provider such as Render, Railway, VPS, or any Node-capable hosting service. Required production environment variables are listed in:

```text
server/.env.example
```

Important backend variables:

```text
MONGODB_URI=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
ADMIN_NOTIFY_EMAIL=
```

## Connect Website to Backend

After deploying the backend, add this GitHub repository variable:

```text
VITE_API_URL=https://your-backend-domain.com/api
```

Optional variables:

```text
VITE_WHATSAPP_NUMBER=919999999999
VITE_GOOGLE_MAPS_API_KEY=
```

Then rerun the GitHub Pages workflow.

## Local Development

```bash
npm run install:all
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```
