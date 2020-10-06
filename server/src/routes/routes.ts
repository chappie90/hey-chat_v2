import authRoutes from './authRoutes';
import contactsRoutes from './contactsRoutes';
import chatsRoutes from './chatsRoutes';

module.exports = function(app) {
  app.use(authRoutes);
  app.use(contactsRoutes);
  app.use(chatsRoutes);
};