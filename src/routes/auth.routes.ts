import { Router } from 'express';
import { validateRequest } from '@/middleware/validation';
import { loginSchema, registerSchema, refreshTokenSchema } from '@/validators/auth.validators';
import {
  register,
  login,
  refresh,
  verifyEmail,
  enable2FA,
  disable2FA,
} from '@/controllers/auth.controller';
import { requireAuth } from '@/middleware/auth';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.get('/verify-email', verifyEmail);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', validateRequest(refreshTokenSchema), refresh);
router.post('/2fa/enable', requireAuth, enable2FA);
router.post('/2fa/disable', requireAuth, disable2FA);

export default router;
