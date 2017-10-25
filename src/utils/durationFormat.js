import moment from 'moment';

export default function durationFormat(duration) {
  let minute = moment.duration(duration).minutes();
  let second = moment.duration(duration).seconds();
  minute = (minute < 10 ? '0' : '') + minute;
  second = (second < 10 ? '0' : '') + second;
  return minute + ':' + second;
}
