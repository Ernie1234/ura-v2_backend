import { Server } from 'socket.io';
import http from 'http';
import { logger } from '@/utils/logger';
import { verifyToken } from '@/services/token.service';
import { Message } from '@/models/message-model';
import { Conversation } from '@/models/conversation-model';

export const initSocket = (server: http.Server): Server => {
  const io = new Server(server, { cors: { origin: '*' } });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error('Unauthorized'));
      const decoded = verifyToken(String(token)) as { userId: string };
      (socket as { userId: string }).userId = decoded.userId;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', socket => {
    const userId = (socket as { userId: string }).userId;
    socket.join(userId);

    socket.on('chat:join', (conversationId: string) => {
      socket.join(conversationId);
    });

    socket.on(
      'chat:message',
      async (payload: { conversationId: string; content?: string; media?: unknown }) => {
        const msg = await Message.create({
          conversation: payload.conversationId,
          sender: userId,
          senderModel: 'User',
          content: payload.content,
          media: payload.media,
        });
        await Conversation.findByIdAndUpdate(payload.conversationId, { lastMessage: msg._id });
        io.to(payload.conversationId).emit('chat:message', msg);
      }
    );

    socket.on('chat:typing', (conversationId: string) => {
      socket.to(conversationId).emit('chat:typing', { userId });
    });

    socket.on('disconnect', () => {
      logger.debug('socket disconnected', { userId });
    });
  });

  logger.info('Socket.IO initialized');
  return io;
};
