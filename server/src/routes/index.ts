import authRoutes from './authRoutes';
import contactsRoutes from './contactsRoutes';
import chatsRoutes from './chatsRoutes';
import profileRoutes from './profileRoutes';
import pushNotifcationsRoutes from './pushNotificationsRoutes';

module.exports = function(app) {
  app.use(authRoutes);
  app.use(contactsRoutes);
  app.use(chatsRoutes);
  app.use(profileRoutes);
  app.use(pushNotifcationsRoutes);
};