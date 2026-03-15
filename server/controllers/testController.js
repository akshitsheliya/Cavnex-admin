const mongoose = require("mongoose");

const testAPI = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "API working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
};

const testDatabase = async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    res.status(200).json({
      success: true,
      message: "Database connection test",
      database: {
        status: states[dbState],
        name: mongoose.connection.name,
        host: mongoose.connection.host,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
};

const healthCheck = async (req, res) => {
  const healthData = {
    success: true,
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
    },
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  };

  res.status(200).json(healthData);
};

module.exports = {
  testAPI,
  testDatabase,
  healthCheck,
};
