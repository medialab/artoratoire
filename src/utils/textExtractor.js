import words from 'talisman/tokenizers/words';
import phonogram from 'phonogram';
import sonoripy, {createTokenizer} from 'talisman/tokenizers/syllables/sonoripy';

const frenchPoetic = phonogram.french.poetic;

const phonoHierarchy = [
  'aeɛøoɔiuʌyãẽõ',
  'jwɥhʊ',
  'rl',
  'mn',
  'zvðʒ',
  'sfθʃ',
  'bdg',
  'ptkx'
];

const phonoTokenizer = createTokenizer({hierarchy: phonoHierarchy});

export default function textExtractor(text, lang) {
  const sourceString = text.match(/<small>(.*?)<\/small>/g)[0] || '';
  const sourceArray = sourceString.replace(/<\/?small>/g, '').split('<BR>');
  const content = text.replace(/<i>(.*?)<\/i>/g, '')
                          .replace(/<BR>/g, '')
                          .replace(/\n\s*\n/g, '\n');
  const wordList = words(content);

  const syllables = wordList.map((word) => {
    if (lang === 'fr') {
      return {
        word,
        count: phonoTokenizer(frenchPoetic(word)).length
      };
    }
    if (lang === 'en') {
      return {
        word,
        count: sonoripy(word).length
      };
    }
  });

  return {
    content,
    wordCount: wordList.length,
    syllables,
    source: sourceArray[0],
    url: sourceArray[1]
  };
}

