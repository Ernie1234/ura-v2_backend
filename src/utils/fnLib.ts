import { DEFAULT_COVER_IMAGES } from '@/constants';

export const getRandomCoverImage = () => {
  const randomIndex = Math.floor(Math.random() * DEFAULT_COVER_IMAGES.length);
  return DEFAULT_COVER_IMAGES[randomIndex];
};
