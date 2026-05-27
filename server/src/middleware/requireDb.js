export const requireDb = (_req, res, next) => {
  if (global.dbReady !== true) {
    return res.status(503).json({
      message: "Database is not connected. Set MONGODB_URI and restart the server."
    });
  }

  next();
};
