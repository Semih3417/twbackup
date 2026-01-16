import { IMAGE_BASE_URL } from '../api/client';

export const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/600x400?text=Kein+Bild';
  if (path.startsWith('http')) return path; // Externe URL (Unsplash etc.)
  return `${IMAGE_BASE_URL}${path}`; // Lokaler Upload (/uploads/...)
};