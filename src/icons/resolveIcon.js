import { Folder, File } from 'lucide-react';
import { iconMap } from './iconMap';

/**
 * Resolves an icon name from the backend to a corresponding lucide-react component.
 * @param {string} iconName - The icon string from the backend.
 * @param {boolean} hasChildren - Whether the menu item has sub-items (used for fallback).
 * @returns {React.ElementType} The resolved React component.
 */
export const resolveIcon = (iconName, hasChildren) => {
  const IconComponent = iconMap[iconName?.toLowerCase()];
  
  if (IconComponent) {
    return IconComponent;
  }
  
  return hasChildren ? Folder : File;
};
