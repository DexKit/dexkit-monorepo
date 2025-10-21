import {
  Box,
  Card,
  CardActionArea,
  IconButton,
  Link,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

import React, { KeyboardEvent, MouseEvent, useRef, useState } from 'react';

import DragIndicatorIcon from '@mui/icons-material/DragIndicatorOutlined';

import { CSS } from '@dnd-kit/utilities';

import { useIsMobile } from '@dexkit/core';
import { PageSectionsLayout } from '@dexkit/ui/modules/wizard/types/config';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CheckOutlined, CloseOutlined } from '@mui/icons-material';
import MoreVert from '@mui/icons-material/MoreVert';
import dynamic from 'next/dynamic';
import { FormattedMessage } from 'react-intl';
import PreviewPagePlatform from '../PreviewPagePlatform';
import PageSectionMenuStack from './PageSectionMenuStack';

const PageSectionMenu = dynamic(() => import('./PageSectionMenu'));

export interface PageSectionProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  id: string;
  expand?: boolean;
  hideEmbedMenu?: boolean;
  onAction: (action: string) => void;
  onChangeName: (name: string) => void;
  section?: AppPageSection;
  active?: boolean;
  showTopDroppable?: boolean;
  index?: number;
  page?: string;
  siteId?: string;
  layout?: PageSectionsLayout;
}

export default function PageSection({
  icon,
  title,
  subtitle,
  id,
  expand,
  onAction,
  hideEmbedMenu,
  onChangeName,
  section,
  active,
  showTopDroppable,
  siteId,
  page,
  index,
  layout,
}: PageSectionProps) {
  const {
    transform,
    setNodeRef,
    listeners,
    attributes,
    isDragging,
    active: activeNode,
  } = useDraggable({ id, data: { index: id } });

  const { isOver: isOverTop, setNodeRef: setNodeRefDropTop } = useDroppable({
    id: `${id}:top`,
    data: {
      index: '0',
    },
  });

  const { isOver: isOverBottom, setNodeRef: setNodeRefDropBottom } =
    useDroppable({
      id: `${id}:bottom`,
      data: { index: parseInt(id).toString(), position: `bottom` },
    });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [isVisible, setVisible] = useState(false);

  const handleToggleVisibility = () => {
    setVisible((value: any) => !value);
  };

  const [isEdit, setIsEdit] = useState(false);

  const [name, setName] = useState(section?.name || section?.title);

  const handleEdit = () => {
    setIsEdit(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  const handleStopPropagation = (cb: () => void) => {
    return (e: MouseEvent) => {
      e.stopPropagation();
      return cb();
    };
  };

  const handleSave = () => {
    if (name) {
      onChangeName(name);
    }

    setIsEdit(false);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setName(section?.name || section?.title);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const isMobile = useIsMobile();
  const theme = useTheme();

  return (
    <>
      {anchorEl && section && (
        <PageSectionMenu
          hideDesktop={section?.hideDesktop}
          hideMobile={section?.hideMobile}
          isVisible={isVisible}
          anchorEl={anchorEl}
          onClose={handleCloseMenu}
          onAction={onAction}
        />
      )}
      <Box
        sx={{
          display: Boolean(activeNode) && showTopDroppable ? 'block' : 'none',
          height: theme.spacing(0.25),
          position: 'static',
          bgcolor: isOverTop ? theme.palette.primary.main : 'rgba(0,0,0,0)',
        }}
        ref={setNodeRefDropTop}
      />

      <Card
        sx={{
          border: active
            ? `2px solid ${theme.palette.primary.main}`
            : undefined,
          transform: CSS.Translate.toString(transform),
          zIndex: isDragging ? theme.zIndex.snackbar + 1 : undefined,
          borderRadius: Number(theme.shape.borderRadius) / 8,
          mb: theme.spacing(0.5),
          width: '100%',
          mx: 0,
        }}
        ref={setNodeRef}
      >
        <CardActionArea onClick={() => onAction('edit')}>
          <Box sx={{ py: theme.spacing(0.5), px: theme.spacing(0.75) }}>
            <Stack
              spacing={isMobile ? theme.spacing(0.5) : theme.spacing(0.75)}
              alignItems="center"
              justifyContent="space-between"
              direction="row"
            >
              <Stack
                spacing={isMobile ? theme.spacing(1) : theme.spacing(2)}
                alignItems="center"
                justifyContent="space-between"
                direction="row"
              >
                <Tooltip
                  title={
                    <FormattedMessage
                      id="drag.to.reorder"
                      defaultMessage="Drag to reorder"
                    />
                  }
                >
                  <DragIndicatorIcon
                    {...listeners}
                    {...attributes}
                    sx={
                      isMobile
                        ? { fontSize: theme.typography.fontSize * 1.2 }
                        : undefined
                    }
                  />
                </Tooltip>
                <Box>
                  {isEdit ? (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={theme.spacing(0.5)}
                    >
                      <TextField
                        value={name}
                        inputRef={(ref: any) => (inputRef.current = ref)}
                        onClick={(e: any) => e.stopPropagation()}
                        onChange={(e: any) => setName(e.target.value)}
                        variant="standard"
                        size="small"
                        onKeyDown={handleKeyDown}
                        sx={
                          isMobile
                            ? {
                                '.MuiInputBase-input': {
                                  fontSize: theme.typography.caption.fontSize,
                                },
                              }
                            : undefined
                        }
                      />
                      {isMobile && (
                        <>
                          <IconButton
                            size="small"
                            onClick={handleStopPropagation(handleSave)}
                          >
                            <CheckOutlined fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={handleStopPropagation(handleCancel)}
                          >
                            <CloseOutlined fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Stack>
                  ) : (
                    <Box>
                      <Link
                        variant={isMobile ? 'body2' : 'body1'}
                        underline="none"
                        sx={{ cursor: 'pointer' }}
                        // onClick={handleStopPropagation(handleEdit)}
                        color="text.primary"
                      >
                        {title}
                      </Link>

                      <Typography
                        variant={isMobile ? 'caption' : 'body2'}
                        color="text.secondary"
                        sx={
                          isMobile
                            ? {
                                display: 'block',
                                maxWidth: theme.spacing(17.5),
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }
                            : undefined
                        }
                      >
                        {subtitle}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
              <Stack
                direction="row"
                spacing={theme.spacing(0.5)}
                alignItems="center"
              >
                {expand && section ? (
                  <Box pr={isMobile ? 0 : theme.spacing(4)}>
                    <PageSectionMenuStack
                      hideDesktop={section?.hideDesktop}
                      hideEmbedMenu={hideEmbedMenu}
                      hideMobile={section?.hideMobile}
                      isVisible={isVisible}
                      onAction={onAction}
                      onToggleVisibilty={handleToggleVisibility}
                    />
                  </Box>
                ) : (
                  <IconButton
                    onClick={handleOpenMenu}
                    size={isMobile ? 'small' : 'medium'}
                  >
                    <MoreVert fontSize={isMobile ? 'small' : 'medium'} />
                  </IconButton>
                )}
              </Stack>
            </Stack>
          </Box>
        </CardActionArea>
        {isVisible && section && (
          <PreviewPagePlatform
            sections={[section]}
            page={page}
            site={siteId}
            index={index}
            disabled={true}
            layout={layout}
          />
        )}
      </Card>
      <Box
        sx={{
          display: Boolean(activeNode) ? 'block' : 'none',
          height: theme.spacing(0.25),
          position: 'static',
          bgcolor: isOverBottom ? theme.palette.primary.main : 'rgba(0,0,0,0)',
        }}
        ref={setNodeRefDropBottom}
      />
    </>
  );
}
