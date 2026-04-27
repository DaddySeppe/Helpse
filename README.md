# HELPSE

Helpse is een lokaal platform waar:

- Customers hulpvragen posten
- Students kleine taken uitvoeren en geld verdienen

Voorbeelden: computerhulp, tuinwerk, verhuizen, boodschappen, schoonmaak en kleine herstellingen.

## Tech stack

- Frontend: React (Vite), Tailwind CSS, React Router, Axios
- Backend: Node.js, Express
- Database: Supabase PostgreSQL
- Auth: JWT + bcrypt
- Payments: Stripe subscriptions (€2.99/maand)

## Projectstructuur

```txt
/helpse
  /client
    /src
      /api
      /components
      /context
      /pages
      /utils
    App.jsx
    main.jsx
  /server
    /src
      /controllers
      /routes
      /middleware
      /utils
    server.js
  .env.example
  README.md
```

## 1) Installatie

```bash
# in root
cd client
npm install

cd ../server
npm install
```

## 2) Environment variabelen

### Backend

Kopieer `server/.env.example` naar `server/.env`.

```env
PORT=4000
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-secret
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Frontend

Kopieer `client/.env.example` naar `client/.env`.

```env
VITE_API_URL=http://localhost:4000/api
```

## 3) Supabase setup

1. Maak een nieuw Supabase project.
2. Open SQL editor.
3. Run `server/supabase/schema.sql`.
4. Run `server/supabase/seed.sql`.
5. Neem `SUPABASE_URL` en `SUPABASE_SERVICE_ROLE_KEY` over in `server/.env`.

Seed users (wachtwoord `test1234`):

- an.customer@helpse.be (ACTIVE, CUSTOMER)
- mila.student@helpse.be (ACTIVE, STUDENT)
- koen.customer@helpse.be (TRIAL, CUSTOMER)
- lotte.student@helpse.be (TRIAL, STUDENT)

## 4) Stripe setup

1. Maak Stripe account en API keys aan.
2. Zet `STRIPE_SECRET_KEY` in `server/.env`.
3. Start backend lokaal.
4. Forward webhooks:

```bash
stripe listen --forward-to localhost:4000/api/payments/webhook
```

5. Kopieer webhook secret (`whsec_...`) naar `STRIPE_WEBHOOK_SECRET`.

Webhook events verwerkt:

- `checkout.session.completed` -> user wordt `ACTIVE`
- `customer.subscription.deleted` -> user wordt `EXPIRED`
- `invoice.payment_failed` -> user wordt `EXPIRED`

## 5) Project starten

### Start backend

```bash
cd server
npm run dev
```

### Start frontend

```bash
cd client
npm run dev
```

Frontend draait standaard op `http://localhost:5173`.
Backend draait standaard op `http://localhost:4000`.

## Business regels

### Trial model

- Nieuwe user krijgt 3 dagen `TRIAL`
- Tijdens `TRIAL`: alleen lezen
- Na trial: status wordt `EXPIRED`
- `EXPIRED`: enkel pricing flow gebruiken
- Premium: €2.99/maand via Stripe subscription

### Access helper

Backend gebruikt `getUserAccess(user)` in routes:

- `ACTIVE` -> alles toegestaan
- `TRIAL` -> alleen `canRead`
- `EXPIRED` -> alles uit, `mustPay=true`

## API routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Tasks

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `GET /api/tasks/my`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Applications

- `POST /api/tasks/:id/apply`
- `GET /api/applications/my`
- `GET /api/tasks/:id/applications`
- `PATCH /api/applications/:id/accept`
- `PATCH /api/applications/:id/reject`

### Payments

- `POST /api/payments/create-checkout-session`
- `POST /api/payments/webhook`

## Frontend pagina's

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/tasks`
- `/tasks/:id`
- `/tasks/new`
- `/my-tasks`
- `/applications`
- `/pricing`
- `/success`
- `/cancel`
