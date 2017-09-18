export default function getExtractedContent(text) {
  const sourceString = text.match(/<small>(.*?)<\/small>/g)[0] || '';
  const sourceArray = sourceString.replace(/<\/?small>/g, '').split('<BR>');
  const contentText = text.replace(/<i>(.*?)<\/i>/g, '')
                          .replace(/<BR>/g, '')
                          .replace(/\n\s*\n/g, '\n');
  return {
    content: contentText,
    source: sourceArray[0],
    url: sourceArray[1]
  };
}
