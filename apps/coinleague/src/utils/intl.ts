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
  switch (locale) {
    case "en-US":
      return import('../../compiled-lang/en-US.json');
    case "pt-BR":
      return import('../../compiled-lang/pt-BR.json');
    case "es-ES":
      return import('../../compiled-lang/es-ES.json');
    case "de-DE":
      return import('../../compiled-lang/de-DE.json');
    case "nn-NO":
      return import('../../compiled-lang/nn-NO.json');
    case "fr-FR":
      return import('../../compiled-lang/fr-FR.json');
    case "it-IT":
      return import('../../compiled-lang/it-IT.json');
    case "cs-CZ":
        return import('../../compiled-lang/cs-CZ.json');
    default:
      return import('../../compiled-lang/en-US.json');
  }
}