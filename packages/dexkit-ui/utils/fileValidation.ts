export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedName?: string;
}

export interface AllowedFileType {
  extension: string;
  mimeTypes: string[];
  maxSizeBytes: number;
}

export const ALLOWED_MULTIMEDIA_TYPES: Record<string, AllowedFileType> = {
  jpg: {
    extension: '.jpg',
    mimeTypes: ['image/jpeg'],
    maxSizeBytes: 10 * 1024 * 1024,
  },
  jpeg: {
    extension: '.jpeg',
    mimeTypes: ['image/jpeg'],
    maxSizeBytes: 10 * 1024 * 1024,
  },
  png: {
    extension: '.png',
    mimeTypes: ['image/png'],
    maxSizeBytes: 10 * 1024 * 1024,
  },
  gif: {
    extension: '.gif',
    mimeTypes: ['image/gif'],
    maxSizeBytes: 10 * 1024 * 1024,
  },
  webp: {
    extension: '.webp',
    mimeTypes: ['image/webp'],
    maxSizeBytes: 10 * 1024 * 1024,
  },
  svg: {
    extension: '.svg',
    mimeTypes: ['image/svg+xml'],
    maxSizeBytes: 2 * 1024 * 1024,
  },

  mp4: {
    extension: '.mp4',
    mimeTypes: ['video/mp4'],
    maxSizeBytes: 50 * 1024 * 1024,
  },
  mov: {
    extension: '.mov',
    mimeTypes: ['video/quicktime'],
    maxSizeBytes: 50 * 1024 * 1024,
  },
  webm: {
    extension: '.webm',
    mimeTypes: ['video/webm'],
    maxSizeBytes: 50 * 1024 * 1024,
  },
  avi: {
    extension: '.avi',
    mimeTypes: ['video/x-msvideo'],
    maxSizeBytes: 50 * 1024 * 1024,
  },

  mp3: {
    extension: '.mp3',
    mimeTypes: ['audio/mpeg', 'audio/mp3'],
    maxSizeBytes: 20 * 1024 * 1024,
  },
  wav: {
    extension: '.wav',
    mimeTypes: ['audio/wav', 'audio/wave'],
    maxSizeBytes: 20 * 1024 * 1024,
  },
  ogg: {
    extension: '.ogg',
    mimeTypes: ['audio/ogg'],
    maxSizeBytes: 20 * 1024 * 1024,
  },
  flac: {
    extension: '.flac',
    mimeTypes: ['audio/flac'],
    maxSizeBytes: 20 * 1024 * 1024,
  },
  m4a: {
    extension: '.m4a',
    mimeTypes: ['audio/mp4', 'audio/m4a'],
    maxSizeBytes: 20 * 1024 * 1024,
  },
};

export const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
  '.php', '.asp', '.aspx', '.jsp', '.py', '.rb', '.pl', '.sh', '.ps1',
  '.sql', '.db', '.sqlite', '.mdb', '.accdb',
  '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2',
  '.dll', '.so', '.dylib',
  '.htaccess', '.htpasswd', '.ini', '.conf', '.config',
  '.log', '.tmp', '.temp', '.swp', '.swo',
  '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf',
  '.txt', '.rtf', '.odt', '.ods', '.odp',
];

export function sanitizeFileName(fileName: string): string {
  let sanitized = fileName.replace(/\.\./g, '').replace(/[\/\\]/g, '');

  sanitized = sanitized.replace(/[<>:"|?*\x00-\x1f]/g, '');

  if (sanitized.length > 255) {
    const ext = sanitized.substring(sanitized.lastIndexOf('.'));
    const name = sanitized.substring(0, sanitized.lastIndexOf('.'));
    sanitized = name.substring(0, 255 - ext.length) + ext;
  }

  return sanitized;
}

export function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1) return '';
  return fileName.substring(lastDot).toLowerCase();
}

export function validateMultimediaFile(
  file: File,
  allowedTypes: string[] = Object.keys(ALLOWED_MULTIMEDIA_TYPES)
): FileValidationResult {
  if (file.size === 0) {
    return { isValid: false, error: 'File is empty' };
  }

  const extension = getFileExtension(file.name);

  if (DANGEROUS_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      error: `File type ${extension} is not allowed for security reasons`
    };
  }

  const fileTypeKey = extension.substring(1);
  if (!allowedTypes.includes(fileTypeKey)) {
    return {
      isValid: false,
      error: `File type ${extension} is not supported. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  const fileType = ALLOWED_MULTIMEDIA_TYPES[fileTypeKey];
  if (!fileType) {
    return {
      isValid: false,
      error: `File type ${extension} is not configured`
    };
  }

  if (file.size > fileType.maxSizeBytes) {
    const maxSizeMB = Math.round(fileType.maxSizeBytes / (1024 * 1024));
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`
    };
  }

  if (!fileType.mimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File MIME type '${file.type}' does not match expected type for ${extension}`
    };
  }

  const sanitizedName = sanitizeFileName(file.name);

  return {
    isValid: true,
    sanitizedName: sanitizedName !== file.name ? sanitizedName : undefined
  };
}

export function validateImageFile(file: File): FileValidationResult {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return validateMultimediaFile(file, imageTypes);
}

export function validateVideoFile(file: File): FileValidationResult {
  const videoTypes = ['mp4', 'mov', 'webm', 'avi'];
  return validateMultimediaFile(file, videoTypes);
}

export function validateAudioFile(file: File): FileValidationResult {
  const audioTypes = ['mp3', 'wav', 'ogg', 'flac', 'm4a'];
  return validateMultimediaFile(file, audioTypes);
}

export function getAcceptedFileTypes(allowedTypes: string[] = Object.keys(ALLOWED_MULTIMEDIA_TYPES)): string {
  const mimeTypes: string[] = [];
  const extensions: string[] = [];

  allowedTypes.forEach(typeKey => {
    const fileType = ALLOWED_MULTIMEDIA_TYPES[typeKey];
    if (fileType) {
      mimeTypes.push(...fileType.mimeTypes);
      extensions.push(fileType.extension);
    }
  });

  return [...mimeTypes, ...extensions].join(',');
}

export function getAcceptedImageTypes(): string {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return getAcceptedFileTypes(imageTypes);
}

export function getAcceptedVideoTypes(): string {
  const videoTypes = ['mp4', 'mov', 'webm', 'avi'];
  return getAcceptedFileTypes(videoTypes);
}

export function getAcceptedAudioTypes(): string {
  const audioTypes = ['mp3', 'wav', 'ogg', 'flac', 'm4a'];
  return getAcceptedFileTypes(audioTypes);
}

export function getAcceptedMultimediaTypes(): string {
  return getAcceptedFileTypes();
}
