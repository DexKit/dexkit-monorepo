import { useEffect, useState } from 'react';
import { ThemeMode } from '../../constants/enum';
import { useThemeMode } from './useThemeMode';

export function useForceThemeMode() {
  const { mode, setThemeMode } = useThemeMode();
  const [forceMode, setForceMode] = useState<ThemeMode | null>(null);

  useEffect(() => {
    const detectThemeFromDOM = () => {
      const body = document.body;
      const hasDarkClass = body.classList.contains('dark') || body.classList.contains('Mui-dark');
      const hasLightClass = body.classList.contains('light') || body.classList.contains('Mui-light');

      const dataTheme = body.getAttribute('data-theme');

      const muiColorScheme = body.getAttribute('data-mui-color-scheme');

      const computedStyle = window.getComputedStyle(body);
      const backgroundColor = computedStyle.backgroundColor;

      const isDarkByBackground = backgroundColor && (
        backgroundColor.includes('rgb(0, 0, 0)') ||
        backgroundColor.includes('rgb(26, 26, 26)') ||
        backgroundColor.includes('#000') ||
        backgroundColor.includes('#1a1a1a')
      );

      let detectedMode: ThemeMode | null = null;

      if (hasDarkClass || dataTheme === 'dark' || muiColorScheme === 'dark' || isDarkByBackground) {
        detectedMode = ThemeMode.dark;
      } else if (hasLightClass || dataTheme === 'light' || muiColorScheme === 'light') {
        detectedMode = ThemeMode.light;
      }

      if (detectedMode && detectedMode !== forceMode) {
        setForceMode(detectedMode);
      }
    };

    detectThemeFromDOM();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' &&
          (mutation.attributeName === 'class' ||
            mutation.attributeName === 'data-theme' ||
            mutation.attributeName === 'data-mui-color-scheme')) {
          detectThemeFromDOM();
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'data-mui-color-scheme']
    });

    const styleObserver = new MutationObserver(() => {
      detectThemeFromDOM();
    });

    styleObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['style']
    });

    return () => {
      observer.disconnect();
      styleObserver.disconnect();
    };
  }, [forceMode]);

  return {
    mode: forceMode || mode,
    setThemeMode,
    isForced: !!forceMode,
    originalMode: mode
  };
}
