import {SEC_BUFFER, THRESHOLD, SAMPLE_RATE, MIN_DURATION} from '../constants/AudioConstants';

export function silenceCount(buffer, threshold = THRESHOLD, dMin = MIN_DURATION) {
  dMin = SEC_BUFFER * dMin;

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
  return count / SEC_BUFFER;
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
    if (bar.rms < threshold) count++;
  }

  return count * step / SEC_BUFFER;
}

export function normalizedBuffer(data, threshold = THRESHOLD, dMin = MIN_DURATION) {
  const buffer = [];
  const step = dMin * SEC_BUFFER;
  for (let i = 0; i < data.length / step; i ++) {
    const bar = sampleProps(data, i, step);
    if (bar.rms < threshold) buffer.push(0);
    else buffer.push(1);
  }
  const groupBuffer = buffer.join('').match(/([0-9])\1*/g) || [];
  const normBuffer = groupBuffer.map((d, i) => {
    return {
      index: i,
      duration: d.length * dMin,
      status: d[0] === '0' ? 'silence' : 'speaking'
    };
  });

  return normBuffer;
}

const getSpeechLabel = (buffer) => {
  let iterSilence = 0;
  const shortSilence = MIN_DURATION * SEC_BUFFER / SAMPLE_RATE;
  const longSilence = SEC_BUFFER / SAMPLE_RATE;

  const labels = new Array(buffer.length).fill('speaking');
  buffer.forEach((d, i) => {
    if (d === 1) iterSilence = 0;
    else {
      iterSilence = iterSilence + 1;
      if (iterSilence > shortSilence && iterSilence <= longSilence) {
        for (let j = (i - iterSilence + 1); j <= i; j++) {
          labels[j] = 'short';
        }
      }
      else if (iterSilence > longSilence) {
        for (let j = (i - iterSilence + 1); j <= i; j++) {
          labels[j] = 'long';
        }
      }
    }
  });
  return labels;
};

export function getSpeechData(data, threshold = THRESHOLD, step = SAMPLE_RATE) {
  const buffer = [];
  const sampleData = [];
  for (let i = 0; i < data.length / step; i ++) {
    const bar = sampleProps(data, i, step);
    if (bar.rms < threshold) buffer.push(0);
    else buffer.push(1);
    sampleData.push(bar);
  }
  const labels = getSpeechLabel(buffer);
  const speechData = labels.map((d, i) => {
    return {
      ...sampleData[i],
      label: labels[i]
    };
  });
  return speechData;
}
