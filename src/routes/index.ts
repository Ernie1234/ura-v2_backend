import { Router } from 'express';

import authRoutes from '@/routes/passport-auth.routes';
import chatRoutes from '@/routes/chat.routes';
import userRoutes from '@/routes/user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/user', userRoutes);

export default router;
