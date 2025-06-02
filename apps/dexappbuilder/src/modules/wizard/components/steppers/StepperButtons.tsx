import { StepperButtonProps } from '@/modules/wizard/types';
import Button from '@mui/material/Button';
import { FormattedMessage } from 'react-intl';

export function StepperButtons({
  handleBack,
  handleNext,
  isLastStep,
  isFirstStep,
  disableContinue,
}: StepperButtonProps) {
  return (
    <>
      <Button
        variant="contained"
        onClick={handleNext}
        sx={{ mt: 1, mr: 1 }}
        disabled={disableContinue}
      >
        {isLastStep ? (
          <FormattedMessage id="finish" defaultMessage={'Finish'} />
        ) : (
          <FormattedMessage id="continue" defaultMessage={'Continue'} />
        )}
      </Button>
      <Button disabled={isFirstStep} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
        <FormattedMessage id="back" defaultMessage={'Back'} />
      </Button>
    </>
  );
}
