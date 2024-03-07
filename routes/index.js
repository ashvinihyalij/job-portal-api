import authRoutes from './authRoutes.js';
import passwordResetRoutes from './passwordReset.js';
const setupRoutes = (app) => {
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/password-reset', passwordResetRoutes);
}

export default setupRoutes;