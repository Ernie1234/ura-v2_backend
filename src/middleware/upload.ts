import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { config } from '@/config/env.config';
import { FileUploadError } from '@/utils/errors';
import { UPLOAD_DESTINATIONS } from '@/config/constants';

// File type validation
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
): void => {
  const allowedTypes = config.upload.allowedTypes;

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new FileUploadError(
        `File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      )
    );
  }
};

// Storage configuration for local uploads
const localStorage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, callback) => {
    const destination = UPLOAD_DESTINATIONS.TEMP;
    callback(null, `uploads/${destination}`);
  },
  filename: (_req: Request, file: Express.Multer.File, callback) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    callback(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

// Memory storage for direct upload to cloud services
const memoryStorage = multer.memoryStorage();

// Base multer configuration
const createUploadMiddleware = (storage: multer.StorageEngine): multer.Multer => {
  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: config.upload.maxFileSize,
      files: 5, // Maximum number of files
      fields: 20, // Maximum number of non-file fields
    },
  });
};

// Local storage upload
export const uploadLocal = createUploadMiddleware(localStorage);

// Memory storage upload (for cloud uploads)
export const uploadMemory = createUploadMiddleware(memoryStorage);

// Specific upload configurations
export const uploadSingle = (
  fieldName: string,
  useMemory: boolean = false
): multer.RequestHandler => {
  const upload = useMemory ? uploadMemory : uploadLocal;
  return upload.single(fieldName);
};

export const uploadMultiple = (
  fieldName: string,
  maxCount: number = 5,
  useMemory: boolean = false
): multer.RequestHandler => {
  const upload = useMemory ? uploadMemory : uploadLocal;
  return upload.array(fieldName, maxCount);
};

export const uploadFields = (
  fields: Array<{ name: string; maxCount?: number }>,
  useMemory: boolean = false
): multer.RequestHandler => {
  const upload = useMemory ? uploadMemory : uploadLocal;
  return upload.fields(fields);
};

// Profile picture upload (single image)
export const uploadProfilePicture = uploadSingle('avatar', true); // Use memory for cloud upload

// Document upload (single file)
export const uploadDocument = uploadSingle('document', true);

// Multiple files upload
export const uploadMultipleFiles = uploadMultiple('files', 5, true);
