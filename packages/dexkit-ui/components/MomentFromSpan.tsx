import moment from "moment";
import { memo } from "react";
import { useIntl } from "react-intl";

export interface MomentFromSpanProps {
  from: moment.Moment | number;
}

function MomentFromSpan({ from }: MomentFromSpanProps) {
  const { locale } = useIntl();

  let datetime: moment.Moment;

  if (typeof from === "number") {
    datetime = moment(new Date(from));
  }
  {
    datetime = moment(from);
  }

  datetime.locale(locale);

  return <span style={{ color: 'inherit' }}>{datetime.fromNow()}</span>;
}

export default memo(MomentFromSpan);
