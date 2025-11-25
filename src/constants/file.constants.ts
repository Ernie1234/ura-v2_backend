export const FILE_TYPES = {
  IMAGE: 'image',
  DOCUMENT: 'document',
  VIDEO: 'video',
  AUDIO: 'audio',
  ARCHIVE: 'archive',
} as const;

export type FileType = (typeof FILE_TYPES)[keyof typeof FILE_TYPES];

export const UPLOAD_DESTINATIONS = {
  PROFILES: 'profiles',
  COVERS: 'covers',
  DOCUMENTS: 'documents',
  TEMP: 'temp',
  ATTACHMENTS: 'attachments',
} as const;

export type UploadDestination = (typeof UPLOAD_DESTINATIONS)[keyof typeof UPLOAD_DESTINATIONS];

export const FILE_EXTENSIONS = {
  IMAGE: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  DOCUMENT: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
  VIDEO: ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
  AUDIO: ['.mp3', '.wav', '.ogg', '.m4a'],
} as const;

export const FILE_LIMITS = {
  // In bytes
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  DOCUMENT_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  VIDEO_MAX_SIZE: 100 * 1024 * 1024, // 100MB
  AUDIO_MAX_SIZE: 20 * 1024 * 1024, // 20MB

  // Dimensions (for images)
  IMAGE_MAX_WIDTH: 2048,
  IMAGE_MAX_HEIGHT: 2048,
} as const;
