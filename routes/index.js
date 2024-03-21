import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import passwordResetRoutes from './passwordReset.js';
const setupRoutes = (app) => {
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/auth/password-reset', passwordResetRoutes);
    app.use('/api/v1/user', userRoutes);
}

export default setupRoutes;