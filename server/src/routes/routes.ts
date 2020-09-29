const authRoutes = require('./authRoutes');

module.exports = function(app) {
  app.use(authRoutes);
};