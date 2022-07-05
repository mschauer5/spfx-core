import moment from 'moment';
import h2p from 'html2plaintext';

export const toAtLeastTwoDigit = (val: number): string => {
  if (val < 10) {
    return `0${val}`;
  }

  return `${val}`;
};

export const toCurrency = (val: number, decimal = 0, defaultToZero = false, locales = 'en-US', currency = 'USD') => {
  if (!val) {
    if (defaultToZero) {
      val = 0;
    } else {
      return '';
    }
  }

  const formatter = new Intl.NumberFormat(locales, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimal
  });

  return formatter.format(val);
};

export const toPascal = (val: string) => {
  if (!val) {
    return '';
  }

  return val.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
    return g1.toUpperCase() + g2.toLowerCase();
  });
};

export const toString = (val: string) => {
  if (!val) {
    return '';
  }

  return val;
};

export const toDate = (val: Date, format = 'MMM DD, YYYY') => {
  if (!val) {
    return '';
  }
  return moment(val).format(format);
};

export const toFileName = (val: string) => {
  return val.replace(/[/\\?%*:|"<>]/g, '-');
};

export const toDateFileName = () => {
  const d = new Date();
  const cDay = d.getDate();
  const cMonth = d.getMonth() + 1;
  const cYear = d.getFullYear();
  const time = d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds();

  return `${cMonth}-${cDay}-${cYear}__${time}`;
};

export const stripHtml = (str: string) => {
  if (str === undefined || str === null) {
    return null;
  }
  return str.replace(/(<([^>]+)>)/gi, '');
};

export const stripQuotes = (str: string) => {
  return str.replace(/['"]+/g, '');
};

export const htmlStringPDFRows = (text: string): [] => {
  const rawText = h2p(text);
  return rawText.split('\n');
};

export const toDecimal = (val: number, decimal = 0) => {
  if (val) {
    return val.toFixed(decimal);
  }

  return '';
};
