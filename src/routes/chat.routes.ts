import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';
import { Conversation } from '@/models/conversation-model';
import { Message } from '@/models/message-model';

const router = Router();

// Create or get conversation between user and business
router.post('/conversations', requireAuth, async (req, res, next) => {
  try {
    const { businessId } = req.body;
    const userId = (req as { user: { id: string } }).user.id;
    const convo = await Conversation.findOneAndUpdate(
      { 'participants.user': userId, 'participants.business': businessId },
      { $setOnInsert: { participants: { user: userId, business: businessId } } },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: convo });
  } catch (err) {
    next(err);
  }
});

// Get messages for a conversation
router.get('/conversations/:id/messages', requireAuth, async (req, res, next) => {
  try {
    const messages = await Message.find({ conversation: req.params.id }).sort({ createdAt: 1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
});

export default router;
