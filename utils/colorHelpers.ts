export const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace('#', '');
  
  if (hex.length !== 6 && hex.length !== 3) {
    return '#ffffff';
  }

  const fullHex = hex.length === 3 
    ? hex.split('').map(char => char + char).join('') 
    : hex;

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#111214' : '#ffffff';
};