/*import deDE from '../../compiled-lang/de-DE.json';
import enUs from '../../compiled-lang/en-US.json';
import esES from '../../compiled-lang/es-ES.json';
import frFR from '../../compiled-lang/fr-FR.json';
import itIT from '../../compiled-lang/it-IT.json';
import nnNO from '../../compiled-lang/nn-NO.json';
import ptBR from '../../compiled-lang/pt-BR.json';
const isProduction = process.env.NODE_ENV === 'production';

const COMPILED_LANGS: { [key: string]: any } = {
  'en-US': isProduction ? enUs : enUs,
  'pt-BR': isProduction ? ptBR : ptBR,
  'es-ES': isProduction ? esES : esES,
  'de-DE': isProduction ? deDE : deDE,
  'nn-NO': isProduction ? nnNO : nnNO,
  'fr-FR': isProduction ? frFR : frFR,
  'it-IT': isProduction ? itIT : itIT,
};

export function loadLocaleData(locale: string) {
  return COMPILED_LANGS[locale];
}*/


export function loadLocaleMessages(locale: string) {
  // Usar rutas desde el package root para que funcionen tanto en desarrollo como con builds compilados
  switch (locale) {
    case "en-US":
      return import('@dexkit/dexappbuilder-viewer/constants/compiled-lang/en-US.json');
    case "pt-BR":
      return import('@dexkit/dexappbuilder-viewer/constants/compiled-lang/pt-BR.json');
    case "es-ES":
      return import('@dexkit/dexappbuilder-viewer/constants/compiled-lang/es-ES.json');
    case "de-DE":
      return import('@dexkit/dexappbuilder-viewer/constants/compiled-lang/de-DE.json');
    case "nn-NO":
      return import('@dexkit/dexappbuilder-viewer/constants/compiled-lang/nn-NO.json');
    case "fr-FR":
      return import('@dexkit/dexappbuilder-viewer/constants/compiled-lang/fr-FR.json');
    case "it-IT":
      return import('@dexkit/dexappbuilder-viewer/constants/compiled-lang/it-IT.json');
    case "cs-CZ":
      return import('@dexkit/dexappbuilder-viewer/constants/compiled-lang/cs-CZ.json');
    default:
      return import('@dexkit/dexappbuilder-viewer/constants/compiled-lang/en-US.json');
  }
}