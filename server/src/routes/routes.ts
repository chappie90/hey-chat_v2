const authRoutes = require('./authRoutes');
const contactsRoutes = require('./contactsRoutes');

module.exports = function(app) {
  app.use(authRoutes);
  app.use(contactsRoutes);
};