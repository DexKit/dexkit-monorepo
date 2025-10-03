import moment from 'moment';
import React from 'react';

export function DatetimeFromNowSpan({
  value,
}: {
  value: number;
  format?: string;
}) {
  return <span>{moment(new Date(value)).fromNow()}</span>;
}

export default DatetimeFromNowSpan;
