// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const compression = require("compression");
// const dotenv = require("dotenv");
// const path = require("path");
// const connectDB = require("./config/db");
// const routes = require("./routes");
// const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// // Load env vars
// dotenv.config();

// // Connect to database
// connectDB();

// const app = express();

// // ✅ Trust proxy (required for Render, Railway, Heroku, etc.)
// app.set("trust proxy", 1);

// // Security Middleware
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//     crossOriginEmbedderPolicy: false,
//   })
// );

// // ✅ CORS Configuration - FIXED
// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "https://admin.cavnex.in",
//   "https://cavnex.in",
//   "https://www.cavnex.in",
// ];

// // ✅ STEP 1: Handle CORS manually BEFORE everything else
// app.use((req, res, next) => {
//   const origin = req.headers.origin;

//   // Check if origin is allowed
//   if (!origin || allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin || "*");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PUT, PATCH, DELETE, OPTIONS"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization, X-Requested-With, Accept, Origin"
//     );
//     res.setHeader("Access-Control-Max-Age", "86400");
//   }

//   // ✅ Handle preflight OPTIONS request immediately
//   if (req.method === "OPTIONS") {
//     console.log("✅ Preflight OPTIONS request handled:", req.path);
//     return res.status(204).end();
//   }

//   next();
// });

// // ✅ STEP 2: Also use cors middleware as backup
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.log("❌ CORS blocked origin:", origin);
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: [
//     "Content-Type",
//     "Authorization",
//     "X-Requested-With",
//     "Accept",
//     "Origin",
//   ],
//   exposedHeaders: ["Content-Range", "X-Content-Range"],
//   maxAge: 86400,
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));

// // Body Parsing
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // Compression
// app.use(compression());

// // Request Logger (Development)
// if (process.env.NODE_ENV === "development") {
//   app.use((req, res, next) => {
//     console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//     next();
//   });
// }

// // Static Files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Health Check
// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "Software Agency Admin API",
//     version: "1.0.0",
//     environment: process.env.NODE_ENV || "development",
//     timestamp: new Date().toISOString(),
//   });
// });

// // API Routes
// app.use("/api", routes);

// // Error Handling
// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// const server = app.listen(PORT, () => {
//   console.log(
//     `\n🚀 Server running in ${process.env.NODE_ENV || "development"} mode`
//   );
//   console.log(`📡 API URL: http://localhost:${PORT}/api`);
//   console.log(`🌍 Public API: http://localhost:${PORT}/api/public`);
//   console.log(`❤️  Health Check: http://localhost:${PORT}/\n`);
//   console.log(`🌐 Allowed Origins: ${allowedOrigins.join(", ")}\n`);
// });

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (err, promise) => {
//   console.error(`❌ Unhandled Rejection: ${err.message}`);
//   server.close(() => process.exit(1));
// });

// // Handle uncaught exceptions
// process.on("uncaughtException", (err) => {
//   console.error(`❌ Uncaught Exception: ${err.message}`);
//   process.exit(1);
// });

// module.exports = app;

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://admin.cavnex.in",
  "https://cavnex.in",
  "https://www.cavnex.in",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    );
    res.setHeader("Access-Control-Max-Age", "86400");
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: false,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Software Agency Admin API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `\n🚀 Server running in ${process.env.NODE_ENV || "development"} mode`
  );
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Public API: http://localhost:${PORT}/api/public`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/`);
  console.log(`🌐 Allowed Origins: ${allowedOrigins.join(", ")}\n`);
});

process.on("unhandledRejection", (err, promise) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

module.exports = app;
