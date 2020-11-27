import moment from 'moment';

export const formatDate = (date: string | Date) => {
  const inputDate = moment(date);
  const diff = moment().diff(inputDate, 'days');

  let outputDate;

  moment.updateLocale('en', {
    relativeTime: {
      past: '%s ago',
      s:  'seconds',
      ss: '%ss',
      m:  'a minute',
      mm: '%dmin',
      h:  'an hour',
      hh: '%dh'
    }
  });

  if (diff === 0) {
    outputDate = inputDate.fromNow(); 
  } else if (diff < 7) {
    outputDate = inputDate.format('dddd');
  } else {
    outputDate = inputDate.format('ll');
  }

  return outputDate;
};