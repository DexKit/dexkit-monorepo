import { Button, Card, CardContent, Divider, Stack } from '@mui/material';
import { FieldArray, Form, useFormikContext } from 'formik';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CollectionItemsForm } from '../types';
import CollectionItemForm from './CollectionItemForm';

interface Props {
  onPrevious: () => void;
}

export default function CollectionItemsCard({ onPrevious }: Props) {
  const { submitForm, isValid, values } =
    useFormikContext<CollectionItemsForm>();

  return (
    <Card>
      <CardContent>
        <Form>
          <FieldArray
            name="items"
            render={(arrayHelper) => (
              <Stack spacing={2}>
                {values.items?.map((_, index: number, arr: any[]) => (
                  <React.Fragment key={index}>
                    <CollectionItemForm itemIndex={index} />
                    {index < arr.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                <Button variant="outlined" onClick={() => arrayHelper.push({})}>
                  <FormattedMessage id="add.item" defaultMessage="Add item" />
                </Button>
                <Stack direction="row" justifyContent="space-between">
                  <Button
                    onClick={onPrevious}
                    variant="outlined"
                    color="primary"
                  >
                    <FormattedMessage id="previous" defaultMessage="Previous" />
                  </Button>

                  <Button
                    disabled={!isValid}
                    onClick={submitForm}
                    variant="contained"
                    color="primary"
                  >
                    <FormattedMessage id="next" defaultMessage="Next" />
                  </Button>
                </Stack>
              </Stack>
            )}
          />
        </Form>
      </CardContent>
    </Card>
  );
}
