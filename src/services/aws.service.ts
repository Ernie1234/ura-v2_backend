import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '@/config/env.config';
import { ExternalServiceError } from '@/utils/errors';
import { logger } from '@/utils/logger';

// Initialize S3 client
const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export const uploadToS3 = async (
  file: Express.Multer.File,
  folder: string = 'uploads',
  fileName?: string
): Promise<{ key: string; url: string; bucket: string }> => {
  try {
    const key = fileName || `${folder}/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: config.aws.s3BucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size,
      Metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
      },
    });

    await s3Client.send(command);

    const url = `https://${config.aws.s3BucketName}.s3.${config.aws.region}.amazonaws.com/${key}`;

    logger.info('File uploaded to S3', {
      bucket: config.aws.s3BucketName,
      key,
      size: file.size,
      mimetype: file.mimetype,
    });

    return { key, url, bucket: config.aws.s3BucketName };
  } catch (error) {
    logger.error('S3 upload failed', { error, fileName: file.originalname });
    throw new ExternalServiceError('S3', 'Failed to upload file to S3', error);
  }
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: config.aws.s3BucketName,
      Key: key,
    });

    await s3Client.send(command);

    logger.info('File deleted from S3', {
      bucket: config.aws.s3BucketName,
      key,
    });
  } catch (error) {
    logger.error('S3 delete failed', { error, key });
    throw new ExternalServiceError('S3', 'Failed to delete file from S3', error);
  }
};

export const getSignedDownloadUrl = async (
  key: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: config.aws.s3BucketName,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    logger.debug('Generated signed URL', {
      key,
      expiresIn,
    });

    return url;
  } catch (error) {
    logger.error('Failed to generate signed URL', { error, key });
    throw new ExternalServiceError('S3', 'Failed to generate signed URL', error);
  }
};

export const getSignedUploadUrl = async (
  key: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string> => {
  try {
    const command = new PutObjectCommand({
      Bucket: config.aws.s3BucketName,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    logger.debug('Generated signed upload URL', {
      key,
      contentType,
      expiresIn,
    });

    return url;
  } catch (error) {
    logger.error('Failed to generate signed upload URL', { error, key });
    throw new ExternalServiceError('S3', 'Failed to generate signed upload URL', error);
  }
};
