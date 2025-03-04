import {
  AppPageSection,
  SectionMetadata,
  SectionType,
} from '@dexkit/ui/modules/wizard/types/section';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  ButtonBase,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Grid,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useIsMobile } from '@dexkit/core';
import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import Check from '@mui/icons-material/Check';
import Edit from '@mui/icons-material/Edit';
import { isDeepEqual } from '@mui/x-data-grid/internals';
import { useSnackbar } from 'notistack';
import { BuilderKit } from '../../../constants';
import PreviewPagePlatform from '../../PreviewPagePlatform';
import { SectionFormRender } from '../SectionFormRender';
import { SectionSelector } from '../SectionSelector';
import { SECTION_TYPES_DATA } from '../Sections';

interface Props {
  dialogProps: DialogProps;
  isEdit: boolean;
  onSave: (section: AppPageSection, index: number) => void;
  onSaveName: (name: string) => void;
  index: number;
  section?: AppPageSection;
  builderKit?: BuilderKit;
}

export default function EditSectionDialog({
  dialogProps,
  isEdit,
  onSave,
  onSaveName,
  index,
  section,
  builderKit,
}: Props) {
  const { onClose } = dialogProps;
  const { formatMessage } = useIntl();
  const [sectionType, setSectionType] = useState<SectionType | undefined>(
    section?.type,
  );

  const [sectionMetadata, setSectionMetadata] = useState<
    SectionMetadata | undefined
  >();

  const [changedSection, setChangedSection] = useState<
    AppPageSection | undefined
  >(section);

  const [hasChanges, setHasChanges] = useState(false);

  const [isEditName, setIsEditName] = useState(false);
  const [name, setName] = useState(section?.name || section?.title);

  const inputNameRef = useRef<HTMLInputElement | null>(null);

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
      setSectionType(undefined);
    }
  };

  const handleChangeSectionType = (e: SelectChangeEvent<SectionType>) => {
    setSectionType(e.target.value as SectionType);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleSave = (section: AppPageSection) => {
    if (!hasChanges) {
      return handleClose();
    }

    let sec = { ...section };

    if (name) {
      sec.name = name;
    }

    onSave(sec, index);
    handleClose();
    if (!isEdit) {
      enqueueSnackbar(
        <FormattedMessage
          id="section.created"
          defaultMessage="Section created"
        />,
        { variant: 'success' },
      );
    }
  };

  const handleChange = (section: AppPageSection) => {
    if (!isDeepEqual(section, changedSection)) {
      setHasChanges(true);
    }

    setChangedSection(section);
  };

  const handleEdit = () => {
    setIsEditName(true);
    setTimeout(() => {
      inputNameRef.current?.focus();
    }, 300);
  };

  const handleCancel = () => {
    setIsEditName(false);
  };

  const handleSaveName = () => {
    setIsEditName(false);

    if (name) {
      onSaveName(name);
    }
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const renderSectionType = (sectionType?: SectionType) => {
    return (
      <SectionFormRender
        section={section}
        sectionType={sectionType}
        onSave={handleSave}
        onClose={isEdit ? handleClose : () => setSectionType(undefined)}
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
      setSectionMetadata(
        SECTION_TYPES_DATA.find((s) => s.type === sectionType),
      );
    } else {
      setSectionMetadata(undefined);
    }
  }, [sectionType]);

  const isMobile = useIsMobile();

  const handleKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation();

    if (e.key === 'Enter') {
      handleSaveName();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsEditName(false);
    setName(e.target.value);
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <Stack
            spacing={1}
            direction={'row'}
            alignContent={'center'}
            alignItems={'center'}
          >
            <IconButton aria-label="close dialog" onClick={handleClose}>
              <CloseIcon />
            </IconButton>

            {isEdit ? (
              <Box>
                <FormattedMessage
                  id="edit.section"
                  defaultMessage="Edit Section"
                />
                :
              </Box>
            ) : (
              <Stack
                spacing={2}
                direction={'row'}
                alignContent={'center'}
                alignItems={'center'}
              >
                <Typography variant="inherit">
                  <FormattedMessage
                    id="add.section"
                    defaultMessage="Add Section"
                  />
                </Typography>
                <TextField
                  variant="standard"
                  onChange={handleChangeName}
                  value={name}
                  inputRef={(ref) => (inputNameRef.current = ref)}
                  placeholder={formatMessage({
                    id: 'section.name',
                    defaultMessage: 'Section name',
                  })}
                />
              </Stack>
            )}
            {isEditName && (
              <TextField
                variant="standard"
                onChange={handleChangeName}
                value={name}
                inputRef={(ref) => (inputNameRef.current = ref)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={formatMessage({
                  id: 'section.name',
                  defaultMessage: 'Section name',
                })}
              />
            )}
            {isEdit && !isEditName && (
              <ButtonBase
                sx={{
                  px: 1,
                  py: 0.25,

                  borderRadius: (theme) => theme.shape.borderRadius / 2,
                  '&: hover': {
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.1),
                  },
                }}
                onClick={handleEdit}
              >
                <Typography variant="h6">
                  {section?.name ||
                    section?.title ||
                    formatMessage({
                      id: 'unnamed.section',
                      defaultMessage: 'Unnamed Section',
                    })}
                </Typography>
              </ButtonBase>
            )}
            {isEdit && isMobile && isEditName && (
              <IconButton onClick={handleSaveName}>
                <Check />
              </IconButton>
            )}
            {isEdit && isMobile && !isEditName && (
              <IconButton onClick={handleEdit}>
                <Edit />
              </IconButton>
            )}
          </Stack>
        }
        hideCloseButton
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
