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
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
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

function ResizeHandle() {
  return (
    <PanelResizeHandle
      style={{
        width: '8px',
        background: 'transparent',
        cursor: 'col-resize',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '4px',
          height: '40px',
          backgroundColor: '#e0e0e0',
          borderRadius: '2px',
        }}
      />
    </PanelResizeHandle>
  );
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
        <PanelGroup direction="horizontal">
          <Panel defaultSize={40} minSize={30} style={{ overflow: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
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
          </Panel>
          
          <ResizeHandle />
          
          <Panel defaultSize={60} minSize={40}>
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
          </Panel>
        </PanelGroup>
      </DialogContent>
    </Dialog>
  );
}
