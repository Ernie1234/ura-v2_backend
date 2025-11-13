import { Router } from 'express';
import { requireAuth } from '@/middleware/passport-auth';
import { getCurrentUser, updateProfile } from '@/controllers/user.controller';
import { validateRequest } from '@/middleware/validation';
import { updateProfileSchema } from '@/validators/user.validators';

const router = Router();

router.get('/current', requireAuth, getCurrentUser);
router.patch('/profile', requireAuth, validateRequest(updateProfileSchema), updateProfile);

export default router;
