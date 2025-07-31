import { badgeColors, saveStatuses } from './constants';

export const getBadgeColorClass = (color: keyof typeof badgeColors): string => {
  return badgeColors[color] || badgeColors.gray;
};

export const getSaveStatusIndicator = (status: keyof typeof saveStatuses) => {
  return saveStatuses[status] || saveStatuses.idle;
};

export const formatPrice = (price: string): string => {
  if (!price || price === '0') return 'Gratis';
  if (price.toLowerCase() === 'consultar') return 'Consultar';
  
  // Remove existing formatting
  const numericPrice = price.replace(/[^\d]/g, '');
  
  if (!numericPrice) return price;
  
  // Add thousand separators
  const formatted = new Intl.NumberFormat('es-AR').format(parseInt(numericPrice));
  return `$${formatted}`;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const calculatePriceWithExchange = (
  arsPrice: string,
  exchangeRate: string
): { ars: string; usd: string } => {
  const numericPrice = parseFloat(arsPrice.replace(/[^\d]/g, ''));
  const numericRate = parseFloat(exchangeRate.replace(/[^\d]/g, ''));
  
  if (isNaN(numericPrice) || isNaN(numericRate) || numericRate === 0) {
    return { ars: formatPrice(arsPrice), usd: 'N/A' };
  }
  
  const usdPrice = numericPrice / numericRate;
  return {
    ars: formatPrice(arsPrice),
    usd: `USD $${usdPrice.toFixed(0)}`
  };
};

export const getServiceBadges = (service: any): string[] => {
  const badges: string[] = [];
  
  if (service.isStatic) badges.push('Estático');
  if (service.isDynamic) badges.push('Dinámico');
  
  switch (service.databaseType) {
    case 'none':
      badges.push('Sin BD');
      break;
    case 'sqlite':
      badges.push('SQLite');
      break;
    case 'supabase':
      badges.push('Supabase');
      break;
  }
  
  if (service.isStatic) badges.push('Hosting gratis');
  
  return badges;
};

export const validateServiceData = (service: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!service.name?.trim()) {
    errors.push('El nombre es requerido');
  }
  
  if (!service.description?.trim()) {
    errors.push('La descripción es requerida');
  }
  
  if (!service.developmentPrice?.trim()) {
    errors.push('El precio de desarrollo es requerido');
  }
  
  if (!service.sections?.length) {
    errors.push('Debe tener al menos una sección');
  }
  
  if (!service.features?.length) {
    errors.push('Debe tener al menos una característica');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateProjectData = (project: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!project.title?.trim()) {
    errors.push('El título es requerido');
  }
  
  if (!project.description?.trim()) {
    errors.push('La descripción es requerida');
  }
  
  if (!project.category?.trim()) {
    errors.push('La categoría es requerida');
  }
  
  if (!project.technologies?.length) {
    errors.push('Debe tener al menos una tecnología');
  }
  
  if (project.image && !validateUrl(project.image)) {
    errors.push('La URL de la imagen no es válida');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const exportToJson = (data: any, filename: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(url);
};

export const importFromJson = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Archivo JSON inválido'));
      }
    };
    reader.onerror = () => reject(new Error('Error leyendo el archivo'));
    reader.readAsText(file);
  });
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

export const isDarkMode = (): boolean => {
  return document.documentElement.classList.contains('dark');
};

export const toggleDarkMode = (): void => {
  document.documentElement.classList.toggle('dark');
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop() || '';
};

export const isValidImageUrl = (url: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = getFileExtension(url.toLowerCase());
  return imageExtensions.includes(extension) || url.includes('unsplash.com');
};