const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const languages = {
  'es-ES': 'Spanish',
  'fr-FR': 'French',
  'it-IT': 'Italian',
  'pt-BR': 'Portuguese (Brazil)',
  'cs-CZ': 'Czech',
  'nn-NO': 'Norwegian',
  'de-DE': 'German'
};

const MAX_CONCURRENT_FILES = 7;
const MAX_CONCURRENT_TRANSLATIONS = 50;
const BATCH_SIZE = 100;
const TRANSLATION_DELAY = 50;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function isEnglishText(text) {
  if (!text || typeof text !== 'string' || text.length <= 1) return false;

  const hasNonLatin = /[^\x00-\x7F]/.test(text);
  if (hasNonLatin) return false;

  const englishPatterns = [
    /^[A-Z][a-z]+ [A-Z][a-z]+$/,
    /^[A-Z][a-z]+$/,
    /^[a-z]+ [a-z]+$/,
    /^[A-Z][a-z]+ [a-z]+$/,
    /^[a-z]+ [A-Z][a-z]+$/,
    /^[A-Z][a-z]+ [a-z]+ [a-z]+$/,
    /^[A-Z][a-z]+ [a-z]+ [a-z]+ [a-z]+$/,
  ];

  const onlyEnglish = /^[a-zA-Z\s.,!?;:'"()\-_&%$#@+=<>[\]{}|\\~`]+$/.test(text);
  if (!onlyEnglish) return false;

  const englishWords = [
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'can', 'cannot', 'must', 'shall', 'this', 'that', 'these', 'those',
    'here', 'there', 'where', 'when', 'why', 'how', 'what', 'which', 'who',
    'a', 'an', 'some', 'any', 'all', 'every', 'each', 'no', 'not', 'yes',
    'view', 'edit', 'delete', 'create', 'add', 'remove', 'save', 'cancel',
    'ok', 'yes', 'no', 'true', 'false', 'error', 'success', 'warning', 'info',
    'loading', 'please', 'wait', 'try', 'again', 'select', 'choose', 'click',
    'press', 'enter', 'submit', 'confirm', 'back', 'next', 'previous', 'continue',
    'finish', 'complete', 'done', 'start', 'stop', 'pause', 'resume', 'play',
    'open', 'close', 'show', 'hide', 'display', 'toggle', 'switch', 'change',
    'update', 'refresh', 'search', 'find', 'look', 'see', 'watch', 'listen',
    'read', 'write', 'send', 'receive', 'get', 'give', 'take', 'put', 'set',
    'use', 'make', 'go', 'come', 'move', 'turn', 'run', 'walk', 'sit', 'stand',
    'buy', 'sell', 'pay', 'cost', 'price', 'money', 'dollar', 'cent', 'time',
    'date', 'day', 'week', 'month', 'year', 'hour', 'minute', 'name', 'title',
    'description', 'text', 'message', 'note', 'comment', 'user', 'admin', 'guest',
    'member', 'team', 'group', 'company', 'home', 'page', 'site', 'website',
    'web', 'internet', 'online', 'file', 'folder', 'document', 'image', 'photo',
    'picture', 'video', 'audio', 'sound', 'music', 'voice', 'speak', 'talk',
    'say', 'tell', 'ask', 'answer', 'question', 'reply', 'response', 'feedback',
    'help', 'support', 'contact', 'about', 'info', 'information', 'settings',
    'options', 'preferences', 'configuration', 'setup', 'login', 'logout',
    'sign', 'register', 'account', 'profile', 'password', 'email', 'phone',
    'address', 'location', 'place', 'country', 'city', 'state', 'region',
    'area', 'zone', 'district', 'language', 'english', 'spanish', 'french',
    'german', 'italian', 'portuguese', 'chinese', 'japanese', 'korean',
    'arabic', 'russian', 'color', 'red', 'blue', 'green', 'yellow', 'black',
    'white', 'gray', 'size', 'small', 'medium', 'large', 'big', 'little',
    'huge', 'tiny', 'number', 'count', 'amount', 'quantity', 'total', 'sum',
    'average', 'first', 'last', 'next', 'previous', 'before', 'after',
    'between', 'above', 'below', 'over', 'under', 'inside', 'outside',
    'left', 'right', 'center', 'middle', 'top', 'bottom', 'front', 'back',
    'up', 'down', 'north', 'south', 'east', 'west', 'direction', 'fast',
    'slow', 'quick', 'easy', 'hard', 'difficult', 'simple', 'good', 'bad',
    'better', 'best', 'worse', 'worst', 'great', 'awesome', 'new', 'old',
    'young', 'fresh', 'clean', 'dirty', 'clear', 'bright', 'dark', 'light',
    'hot', 'cold', 'warm', 'cool', 'dry', 'wet', 'full', 'empty', 'open',
    'closed', 'locked', 'unlocked', 'free', 'busy', 'available', 'unavailable',
    'online', 'offline', 'active', 'inactive', 'enabled', 'disabled', 'on',
    'off', 'ok', 'okay', 'sure', 'maybe', 'perhaps', 'probably', 'definitely',
    'always', 'never', 'sometimes', 'often', 'rarely', 'usually', 'today',
    'yesterday', 'tomorrow', 'now', 'then', 'soon', 'later', 'early', 'late',
    'morning', 'afternoon', 'evening', 'night', 'monday', 'tuesday', 'wednesday',
    'thursday', 'friday', 'saturday', 'sunday', 'january', 'february', 'march',
    'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november',
    'december', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
    'nine', 'ten', 'hundred', 'thousand', 'million', 'billion', 'trillion',
    'percent', 'percentage', 'rate', 'ratio', 'proportion', 'fraction', 'plus',
    'minus', 'times', 'divided', 'equals', 'more', 'less', 'greater', 'smaller',
    'higher', 'lower', 'bigger', 'smaller', 'same', 'different', 'similar',
    'equal', 'unequal', 'identical', 'unique', 'special', 'normal', 'regular',
    'standard', 'typical', 'common', 'rare', 'unusual', 'strange', 'weird',
    'odd', 'funny', 'serious', 'important', 'necessary', 'required', 'optional',
    'mandatory', 'forbidden', 'allowed', 'permitted', 'legal', 'illegal', 'safe',
    'dangerous', 'risky', 'secure', 'protected', 'private', 'public', 'shared',
    'personal', 'individual', 'collective', 'group', 'single', 'multiple',
    'double', 'triple', 'quadruple', 'many', 'few', 'several', 'various',
    'different', 'same', 'similar', 'identical', 'exact', 'approximate', 'rough',
    'precise', 'accurate', 'correct', 'wrong', 'right', 'true', 'false', 'real',
    'fake', 'genuine', 'original', 'copy', 'duplicate', 'version', 'edition',
    'release', 'update', 'upgrade', 'downgrade', 'install', 'uninstall', 'remove',
    'add', 'delete', 'create', 'destroy', 'build', 'construct', 'make', 'break',
    'fix', 'repair', 'maintain', 'service', 'support', 'help', 'assist', 'guide',
    'teach', 'learn', 'study', 'practice', 'train', 'exercise', 'work', 'job',
    'career', 'profession', 'business', 'company', 'organization', 'institution',
    'school', 'university', 'hospital', 'clinic', 'office', 'store', 'shop',
    'market', 'mall', 'restaurant', 'hotel', 'house', 'home', 'apartment', 'room',
    'space', 'place', 'location', 'position', 'point', 'spot', 'area', 'zone',
    'region', 'country', 'state', 'city', 'town', 'village', 'street', 'road',
    'avenue', 'boulevard', 'lane', 'drive', 'way', 'path', 'route', 'direction',
    'way', 'method', 'technique', 'approach', 'strategy', 'plan', 'scheme',
    'program', 'project', 'task', 'job', 'work', 'labor', 'effort', 'energy',
    'power', 'force', 'strength', 'weakness', 'advantage', 'disadvantage',
    'benefit', 'cost', 'price', 'value', 'worth', 'quality', 'quantity', 'amount',
    'number', 'count', 'total', 'sum', 'average', 'mean', 'median', 'mode',
    'range', 'minimum', 'maximum', 'limit', 'boundary', 'edge', 'border', 'line',
    'curve', 'angle', 'corner', 'side', 'face', 'surface', 'area', 'volume',
    'space', 'distance', 'length', 'width', 'height', 'depth', 'thickness',
    'diameter', 'radius', 'circumference', 'perimeter', 'weight', 'mass',
    'density', 'pressure', 'temperature', 'heat', 'cold', 'warm', 'cool', 'hot',
    'freezing', 'boiling', 'melting', 'solid', 'liquid', 'gas', 'plasma',
    'matter', 'material', 'substance', 'element', 'compound', 'mixture',
    'solution', 'suspension', 'colloid', 'atom', 'molecule', 'particle', 'wave',
    'frequency', 'amplitude', 'wavelength', 'speed', 'velocity', 'acceleration',
    'deceleration', 'momentum', 'inertia', 'friction', 'resistance', 'conductance',
    'electricity', 'magnetism', 'gravity', 'light', 'sound', 'vibration',
    'oscillation', 'rotation', 'revolution', 'orbit', 'trajectory', 'path',
    'course', 'route', 'way', 'direction', 'bearing', 'heading', 'compass',
    'north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast',
    'southwest', 'up', 'down', 'left', 'right', 'forward', 'backward', 'sideways',
    'diagonal', 'vertical', 'horizontal', 'oblique', 'parallel', 'perpendicular',
    'intersecting', 'converging', 'diverging', 'convergent', 'divergent', 'convex',
    'concave', 'flat', 'curved', 'straight', 'bent', 'twisted', 'spiral', 'helical',
    'circular', 'elliptical', 'oval', 'round', 'square', 'rectangular', 'triangular',
    'polygonal', 'irregular', 'regular', 'symmetric', 'asymmetric', 'balanced',
    'unbalanced', 'stable', 'unstable', 'steady', 'unsteady', 'constant',
    'variable', 'fixed', 'flexible', 'rigid', 'elastic', 'plastic', 'ductile',
    'brittle', 'hard', 'soft', 'tough', 'weak', 'strong', 'durable', 'fragile',
    'resilient', 'robust', 'delicate', 'coarse', 'fine', 'smooth', 'rough',
    'polished', 'matte', 'glossy', 'shiny', 'dull', 'bright', 'dark', 'light',
    'heavy', 'thick', 'thin', 'wide', 'narrow', 'broad', 'deep', 'shallow',
    'high', 'low', 'tall', 'short', 'long', 'brief', 'quick', 'slow', 'fast',
    'rapid', 'swift', 'gradual', 'sudden', 'immediate', 'instant', 'delayed',
    'late', 'early', 'punctual', 'timely', 'untimely', 'premature', 'overdue',
    'recent', 'old', 'ancient', 'modern', 'contemporary', 'current', 'present',
    'past', 'future', 'temporary', 'permanent', 'eternal', 'infinite', 'finite',
    'limited', 'unlimited', 'boundless', 'restricted', 'free', 'confined', 'open',
    'closed', 'locked', 'unlocked', 'secure', 'safe', 'dangerous', 'risky',
    'hazardous', 'harmful', 'beneficial', 'useful', 'useless', 'helpful',
    'harmful', 'good', 'bad', 'evil', 'positive', 'negative', 'neutral',
    'favorable', 'unfavorable', 'advantageous', 'disadvantageous', 'profitable',
    'unprofitable', 'successful', 'unsuccessful', 'effective', 'ineffective',
    'efficient', 'inefficient', 'productive', 'unproductive', 'creative',
    'destructive', 'constructive', 'helpful', 'harmful', 'beneficial', 'detrimental'
  ];

  const textLower = text.toLowerCase();
  const words = textLower.split(/\s+/);

  const englishWordCount = words.filter(word =>
    englishWords.includes(word) ||
    /^[a-z]+$/.test(word)
  ).length;

  const totalWords = words.length;
  const englishRatio = englishWordCount / totalWords;

  return englishRatio > 0.2 || (totalWords <= 3 && englishWordCount > 0);
}

async function translateText(text, targetLanguage) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Translate to ${targetLanguage}. Keep format and placeholders like {variable}. Return only translation.`
        },
        {
          role: "user",
          content: text
        }
      ],
      max_tokens: 500,
      temperature: 0.1
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error(`Error translating: ${error.message}`);
    return text;
  }
}

async function processBatch(translations, targetLanguage) {
  const promises = translations.map(async ({ key, text, data }) => {
    try {
      const translatedText = await translateText(text, targetLanguage);
      if (translatedText && translatedText !== text) {
        data[key].defaultMessage = translatedText;
        return { key, original: text, translated: translatedText, success: true };
      }
      return { key, original: text, translated: text, success: false };
    } catch (error) {
      return { key, original: text, translated: text, success: false };
    }
  });

  return Promise.all(promises);
}

async function processLanguageFile(langCode, isCompiled = false) {
  const folder = isCompiled ? 'compiled-lang' : 'lang';
  const filePath = path.join(folder, `${langCode}.json`);

  if (!fs.existsSync(filePath)) {
    return { translated: 0, total: 0 };
  }

  console.log(`\n⚡ Processing ${filePath}...`);

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const targetLanguage = getTargetLanguage(langCode);
    let translatedCount = 0;
    let totalKeys = 0;
    let englishKeys = [];

    for (const [key, value] of Object.entries(data)) {
      if (value && value.defaultMessage) {
        totalKeys++;
        if (isEnglishText(value.defaultMessage)) {
          englishKeys.push({ key, text: value.defaultMessage, data });
        }
      }
    }

    console.log(`Found ${englishKeys.length} English keys out of ${totalKeys} total keys`);

    if (englishKeys.length === 0) {
      console.log(`No translations needed for ${filePath}`);
      return { translated: 0, total: 0 };
    }

    const batches = [];
    for (let i = 0; i < englishKeys.length; i += BATCH_SIZE) {
      batches.push(englishKeys.slice(i, i + BATCH_SIZE));
    }

    console.log(`Processing ${batches.length} batches of up to ${BATCH_SIZE} translations each...`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`⚡ Batch ${i + 1}/${batches.length} (${batch.length} items)...`);

      const results = await processBatch(batch, targetLanguage);

      const successful = results.filter(r => r.success);
      translatedCount += successful.length;

      console.log(`Batch ${i + 1} completed: ${successful.length}/${batch.length} translated`);

      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, TRANSLATION_DELAY));
      }
    }

    if (translatedCount > 0) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Translated ${translatedCount}/${englishKeys.length} English keys in ${filePath}`);
    }

    return { translated: translatedCount, total: englishKeys.length };

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return { translated: 0, total: 0 };
  }
}

function getTargetLanguage(langCode) {
  return languages[langCode] || langCode;
}

async function translateSuperFast() {
  console.log('Starting SUPER FAST translation with MAXIMUM PARALLELISM...');
  console.log(`Processing ${MAX_CONCURRENT_FILES} files in parallel`);
  console.log(`${MAX_CONCURRENT_TRANSLATIONS} concurrent translations per file`);
  console.log(`Batch size: ${BATCH_SIZE} translations\n`);

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not found');
    process.exit(1);
  }

  const startTime = Date.now();
  let totalTranslated = 0;
  let totalKeys = 0;

  try {
    console.log('Processing lang/ directory in parallel...');
    const langPromises = Object.keys(languages).map(langCode =>
      processLanguageFile(langCode, false)
    );

    const langResults = await Promise.all(langPromises);
    langResults.forEach(result => {
      totalTranslated += result.translated;
      totalKeys += result.total;
    });

    console.log('Processing compiled-lang/ directory in parallel...');
    const compiledPromises = Object.keys(languages).map(langCode =>
      processLanguageFile(langCode, true)
    );

    const compiledResults = await Promise.all(compiledPromises);
    compiledResults.forEach(result => {
      totalTranslated += result.translated;
      totalKeys += result.total;
    });

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log('\nSUPER FAST translation completed!');
    console.log(`Statistics:`);
    console.log(`   - Total keys processed: ${totalKeys}`);
    console.log(`   - Total translations: ${totalTranslated}`);
    console.log(`   - Duration: ${duration} seconds`);
    console.log(`   - Speed: ${Math.round(totalTranslated / (duration / 60))} translations/minute`);
    console.log(`   - Parallelism: ${MAX_CONCURRENT_FILES} files + ${MAX_CONCURRENT_TRANSLATIONS} translations`);

  } catch (error) {
    console.error('Error during translation process:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  translateSuperFast();
}

module.exports = { translateSuperFast, translateText };
