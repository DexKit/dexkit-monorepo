import { localeAtom } from '@/modules/common/atoms';
import { useAtomValue } from 'jotai';
import moment from 'moment';
import { memo } from 'react';

interface Props {
  from: moment.Moment;
}

function MomentSpan({ from }: Props) {
  const locale = useAtomValue(localeAtom);
  const datetime = moment(from);

  datetime.locale(locale);

  return <span>{datetime.fromNow()}</span>;
}

export default memo(MomentSpan);
