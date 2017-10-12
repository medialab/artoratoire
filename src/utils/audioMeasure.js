import {MIN_BUFFER, THRESHOLD, SAMPLE_RATE} from '../constants/AudioConstants';

export function silenceCount(buffer, threshold = THRESHOLD, durationMin = 0.1) {
  const dMin = MIN_BUFFER * durationMin;

  const silenceBuffer = [];

  const normalizeBuffer = buffer.map((d) => {
    if (Math.abs(d) < threshold) return 0;
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

export function sampleProps(data, index, sampleRate = SAMPLE_RATE) {
  let min = 1.0;
  let max = -1.0;
  let total = 0;
  for (let j = 0; j < sampleRate; j++) {
    const datum = data[(index * sampleRate) + j];
    total += datum * datum;
    if (datum < min)
      min = datum;
    if (datum > max)
      max = datum;
  }

  return {
    min,
    max,
    rms: Math.sqrt(total / sampleRate)
  };
}

export function silenceRmsCount(data, threshold = THRESHOLD, step = SAMPLE_RATE) {
  let count = 0;
  for (let i = 0; i < data.length / step; i ++) {
    const bar = sampleProps(data, i, step);
    if (bar.rms > threshold) count++;
  }
  return count * step / MIN_BUFFER;
}
