require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./src/routes/authRoutes");
const tasksRoutes = require("./src/routes/tasksRoutes");
const applicationsRoutes = require("./src/routes/applicationsRoutes");
const paymentsRoutes = require("./src/routes/paymentsRoutes");
const { stripeWebhook } = require("./src/controllers/paymentsController");
const {
  notFoundHandler,
  errorHandler,
} = require("./src/middleware/errorMiddleware");

const app = express();

const defaultClientOrigins = [
  "http://localhost:5173",
  "https://helpse.be",
  "https://www.helpse.be",
];

const allowedOrigins = [
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  ...defaultClientOrigins,
]
  .map((origin) => origin.replace(/\/$/, ""))
  .filter((origin, index, origins) => origins.indexOf(origin) === index);

const allowedOriginHosts = new Set(
  allowedOrigins
    .map((origin) => {
      try {
        return new URL(origin).host;
      } catch {
        return "";
      }
    })
    .filter(Boolean),
);

function isAllowedOrigin(origin) {
  if (!origin) return true;

  const normalizedOrigin = origin.replace(/\/$/, "");
  if (allowedOrigins.includes(normalizedOrigin)) return true;

  try {
    return allowedOriginHosts.has(new URL(origin).host);
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(morgan("dev"));

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  return res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/payments", paymentsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Helpse API draait op poort ${PORT}`);
});
