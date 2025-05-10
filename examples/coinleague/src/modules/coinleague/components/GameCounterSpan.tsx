import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { TimerSpan } from './TimerSpan';

interface Props {
  startsAt: number;
}

export default function GameCounterSpan({ startsAt }: Props) {
  const [countdown, setCountdown] = useState<number>();

  useEffect(() => {
    const interval = setInterval(
      () => {
        const startTime = Math.floor(
          startsAt - Math.round(new Date().getTime() / 1000)
        );
        setCountdown(startTime);
      },
      1000,
      true
    );

    return () => clearInterval(interval);
  });

  if (countdown !== undefined && countdown > 0) {
    return (
      <Typography component="span">
        <FormattedMessage
          id="starts.in.time"
          defaultMessage="Starts in {time}"
          values={{ time: <TimerSpan time={countdown} /> }}
        />
      </Typography>
    );
  }

  return (
    <Typography
      component="span"
      sx={{
        color: (theme) => theme.palette.success.main,
      }}
    >
      <FormattedMessage
        id="coinLeague.readyToPlay"
        defaultMessage="Ready to Play"
      />
    </Typography>
  );
}
