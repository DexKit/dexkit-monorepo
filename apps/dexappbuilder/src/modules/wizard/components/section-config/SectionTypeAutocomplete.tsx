import { SectionType } from '@dexkit/ui/modules/wizard/types/section';
import { Autocomplete, ListItemText, Stack, TextField } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { SECTION_CONFIG } from '../../constants/sections';

interface SectionTypeAutocompleteProps {
  sectionType: SectionType;
  setSectionType: (value: SectionType) => void;
}

function SectionTypeAutocomplete({
  sectionType,
  setSectionType,
}: SectionTypeAutocompleteProps) {
  const { formatMessage } = useIntl();

  const keys = Object.keys(SECTION_CONFIG)
    .map((key) => ({ key, obj: SECTION_CONFIG[key as SectionType] }))
    .filter((k) => k.obj.title !== undefined)
    .sort((a, b) => {
      if (a.obj.title && b.obj.title) {
        return a.obj.title.defaultMessage.localeCompare(
          b.obj.title.defaultMessage
        );
      }

      return 0;
    })
    .map((k) => k.key);

  return (
    <Autocomplete
      options={['' as SectionType, ...keys]}
      getOptionLabel={(opt) => {
        if ((opt as string) === '') {
          return formatMessage({ id: 'all', defaultMessage: 'All' });
        }

        const { title } = SECTION_CONFIG[opt as SectionType];

        return formatMessage({
          id: title?.id,
          defaultMessage: title?.defaultMessage,
        });
      }}
      componentsProps={{
        clearIndicator: { onClick: () => setSectionType('' as SectionType) },
      }}
      value={sectionType || ''}
      onChange={(event, newValue) => {
        if (newValue === null || newValue === undefined) {
          setSectionType('' as SectionType);
        }

        setSectionType(newValue as SectionType);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={
            <FormattedMessage id="section.type" defaultMessage="Section Type" />
          }
          variant="outlined"
          fullWidth
        />
      )}
      renderOption={(props, option) => {
        if ((option as string) === '') {
          return (
            <li {...props}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <ListItemText
                  primary={<FormattedMessage id="all" defaultMessage="All" />}
                />
              </Stack>
            </li>
          );
        }

        return (
          <li {...props}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <ListItemText
                primary={
                  <FormattedMessage
                    id={SECTION_CONFIG[option as SectionType]?.title?.id}
                    defaultMessage={
                      SECTION_CONFIG[option as SectionType]?.title
                        ?.defaultMessage
                    }
                  />
                }
              />
            </Stack>
          </li>
        );
      }}
      fullWidth
    />
  );
}

export default SectionTypeAutocomplete;
