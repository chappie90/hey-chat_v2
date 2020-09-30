import authRoutes from './authRoutes';
import contactsRoutes from './contactsRoutes';

module.exports = function(app) {
  app.use(authRoutes);
  app.use(contactsRoutes);
};