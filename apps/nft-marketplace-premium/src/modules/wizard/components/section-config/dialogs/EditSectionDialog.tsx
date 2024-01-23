import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Grid,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDialogTitle } from '../../../../../components/AppDialogTitle';
import { BuilderKit } from '../../../constants';
import {
  AppPageSection,
  SectionMetadata,
  SectionType,
} from '../../../types/section';
import PreviewPagePlatform from '../../PreviewPagePlatform';
import { SectionFormRender } from '../SectionFormRender';
import { SectionSelector } from '../SectionSelector';
import { sections } from '../Sections';

interface Props {
  dialogProps: DialogProps;
  isEdit: boolean;
  onSave: (section: AppPageSection, index: number) => void;
  index: number;
  section?: AppPageSection;
  builderKit?: BuilderKit;
}

export default function EditSectionDialog({
  dialogProps,
  isEdit,
  onSave,
  index,
  section,
  builderKit,
}: Props) {
  const { onClose } = dialogProps;
  const { formatMessage } = useIntl();
  const [sectionType, setSectionType] = useState<SectionType | undefined>(
    section?.type
  );

  const [sectionMetadata, setSectionMetadata] = useState<
    SectionMetadata | undefined
  >();

  const [changedSection, setChangedSection] = useState<
    AppPageSection | undefined
  >(section);

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
      setSectionType(undefined);
    }
  };

  const handleChangeSectionType = (e: SelectChangeEvent<SectionType>) => {
    setSectionType(e.target.value as SectionType);
  };

  const handleSave = (section: AppPageSection) => {
    onSave(section, index);
    handleClose();
  };

  const handleChange = (section: AppPageSection) => {
    setChangedSection(section);
  };

  const renderSectionType = (sectionType?: SectionType) => {
    return (
      <SectionFormRender
        section={section}
        sectionType={sectionType}
        onSave={handleSave}
        onClose={handleClose}
        onChange={handleChange}
      />
    );
  };

  useEffect(() => {
    if (section) {
      setSectionType(section.type);
    }
  }, [section]);

  useEffect(() => {
    if (sectionType) {
      setSectionMetadata(sections.find((s) => s.type === sectionType));
    } else {
      setSectionMetadata(undefined);
    }
  }, [sectionType]);

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          isEdit ? (
            <Stack
              spacing={2}
              direction={'row'}
              alignContent={'center'}
              alignItems={'center'}
            >
              <IconButton aria-label="close dialog" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
              <Box>
                <FormattedMessage
                  id="edit.section"
                  defaultMessage="Edit Section"
                />
                :
              </Box>
              <Box>{section?.title || ''}</Box>
            </Stack>
          ) : (
            <Stack
              spacing={2}
              direction={'row'}
              alignContent={'center'}
              alignItems={'center'}
            >
              <IconButton aria-label="close dialog" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
              <FormattedMessage id="add.section" defaultMessage="Add Section" />
            </Stack>
          )
        }
        hideCloseButton={true}
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={5} lg={5} xl={4}>
            {!sectionType && (
              <SectionSelector
                onClickSection={(s) => {
                  setSectionType(s.sectionType);
                  setChangedSection(undefined);
                }}
              />
            )}
            {sectionType && (
              <Stack spacing={2}>
                <Grid container alignItems={'center'} sx={{ pl: 3 }}>
                  <Grid item xs={3}>
                    <IconButton
                      aria-label="delete"
                      size="large"
                      onClick={() => {
                        setSectionType(undefined);
                      }}
                    >
                      <ArrowBackIosIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={7}>
                    <Box display={'flex'} justifyContent={'center'}>
                      <Stack
                        justifyContent={'center'}
                        direction={'row'}
                        alignItems={'center'}
                        spacing={1}
                      >
                        {sectionMetadata?.icon}

                        <Typography variant="subtitle1">
                          {' '}
                          {(sectionMetadata?.titleId &&
                            formatMessage({
                              id: sectionMetadata?.titleId,
                              defaultMessage:
                                sectionMetadata?.titleDefaultMessage,
                            })) ||
                            ''}
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>

                {renderSectionType(sectionType)}
              </Stack>
            )}
          </Grid>

          {/* <Grid item xs={8}>
            <FormControl fullWidth>
              <InputLabel>
                <FormattedMessage
                  id="section.type"
                  defaultMessage="Section type"
                />
              </InputLabel>
              <Select
                label={
                  <FormattedMessage
                    id="section.type"
                    defaultMessage="Section type"
                  />
                }
                fullWidth
                value={sectionType}
                onChange={handleChangeSectionType}
              >
                <MenuItem value="video">
                  <FormattedMessage id="video" defaultMessage="Video" />
                </MenuItem>
                {builderKit !== BuilderKit.Swap && (
                  <MenuItem value="call-to-action">
                    <FormattedMessage
                      id="call.to.action"
                      defaultMessage="Call to action"
                    />
                  </MenuItem>
                )}
                {builderKit !== BuilderKit.Swap && (
                  <MenuItem value="featured">
                    <FormattedMessage id="featured" defaultMessage="Featured" />
                  </MenuItem>
                )}
                {builderKit !== BuilderKit.Swap && (
                  <MenuItem value="collections">
                    <FormattedMessage
                      id="featured"
                      defaultMessage="Collections"
                    />
                  </MenuItem>
                )}
                {builderKit !== BuilderKit.NFT && (
                  <MenuItem value="swap">
                    <FormattedMessage id="swap" defaultMessage="Swap" />
                  </MenuItem>
                )}
                {builderKit !== BuilderKit.Swap && (
                  <MenuItem value="asset-store">
                    <FormattedMessage
                      id="nft.store"
                      defaultMessage="NFT store"
                    />
                  </MenuItem>
                )}
                <MenuItem value="markdown">
                  <FormattedMessage id="markdown" defaultMessage="Markdown" />
                </MenuItem>
                <MenuItem value="wallet">
                  <FormattedMessage id="wallet" defaultMessage="Wallet" />
                </MenuItem>
                <MenuItem value="contract">
                  <FormattedMessage id="contract" defaultMessage="Contract" />
                </MenuItem>
                <MenuItem value="user-contract-form">
                  <FormattedMessage
                    id="User contract form"
                    defaultMessage="User contract form"
                  />
                </MenuItem>
                <MenuItem value="exchange">
                  <FormattedMessage id="exchange" defaultMessage="Exchange" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
          {/*<Grid item xs={6}>
            {renderSectionType(sectionType)}
          </Grid>*/}
          <Grid item xs={12} sm={6} md={7} lg={7} xl={8}>
            <PreviewPagePlatform
              key={sectionType}
              sections={sectionType ? [changedSection as AppPageSection] : []}
              title={
                <b>
                  <FormattedMessage
                    id={'preview.section'}
                    defaultMessage={'Preview section'}
                  />
                </b>
              }
              disabled={true}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
