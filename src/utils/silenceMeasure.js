const MIN_BUFFER = 48000;

export default function silenceMeasure(buffer, threshold = 0.02, durationMin = 0.1) {
  const dMin = MIN_BUFFER * durationMin;

  const silenceBuffer = [];

  const normalizeBuffer = buffer.map((d) => {
    if (d < threshold) return 0;
    else return 1;
  }).join('');

  const groupBuffer = normalizeBuffer.match(/([0-9])\1*/g) || [];
  groupBuffer.forEach((item) => {
    if (item[0] === '0' && item.length >= dMin)
      silenceBuffer.push(item.length);
  });
  const count = silenceBuffer.reduce((a, b) => a + b, 0);
  return count / MIN_BUFFER;
}

