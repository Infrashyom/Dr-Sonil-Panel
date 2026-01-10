
export const getYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const getYoutubeThumbnail = (url: string): string => {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : '';
};

export const getYoutubeEmbedUrl = (url: string): string => {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : '';
};

export const getInstagramEmbedUrl = (url: string): string => {
  if (!url) return '';
  // Extract the reel ID from standard URL like https://www.instagram.com/reel/C8a1b2c3d/?igsh=...
  const match = url.match(/\/reel\/([^/?#&]+)/);
  if (match && match[1]) {
    // Return the embed URL
    return `https://www.instagram.com/reel/${match[1]}/embed`;
  }
  return '';
};
