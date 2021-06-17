export const encodeDateWithTime = (value: Date, withoutTimezone?: boolean): string | undefined => {
  if (value.toString() === 'Invalid Date') return undefined;
  return (
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    toHyphenDate(value) +
    'T' +
    pad(value.getHours()) +
    ':' +
    pad(value.getMinutes()) +
    ':' +
    pad(value.getSeconds()) +
    '.' +
    (value.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
    (withoutTimezone ? '' : `+${pad(value.getTimezoneOffset() / -60)}:00`)
  );
};

export const toHyphenDate = (value: Date): string | undefined => {
  if (value.toString() === 'Invalid Date') return undefined;
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
};

export const toHyphenDateTime = (value: Date): string | undefined => {
  if (value.toString() === 'Invalid Date') return undefined;
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getDay())}:${pad(
    value.getMinutes()
  )}`;
};

export const pad = (number: number): string => {
  if (number < 10 && number >= 0) {
    return '0' + String(number);
  }
  if (number < 0 && number > -10) {
    return '-0' + String(number);
  }
  return String(number);
};
