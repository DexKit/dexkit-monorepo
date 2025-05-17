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
    setVisible((value) => !value);
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
        sx={(theme) => ({
          display: Boolean(activeNode) && showTopDroppable ? 'block' : 'none',
          height: 2,
          position: 'static',
          bgcolor: isOverTop ? theme.palette.primary.main : 'rgba(0,0,0,0)',
        })}
        ref={setNodeRefDropTop}
      />

      <Card
        sx={{
          border: active
            ? (theme) => `2px solid ${theme.palette.primary.main}`
            : undefined,
          transform: CSS.Translate.toString(transform),
          zIndex: isDragging ? (theme) => theme.zIndex.snackbar + 1 : undefined,
          borderRadius: 1,
          mb: 0.5,
          width: '100%',
          mx: 0
        }}
        ref={setNodeRef}
      >
        <CardActionArea onClick={() => onAction('edit')}>
          <Box sx={{ py: 0.5, px: 0.75 }}>
            <Stack
              spacing={isMobile ? 0.5 : 0.75}
              alignItems="center"
              justifyContent="space-between"
              direction="row"
            >
              <Stack
                spacing={isMobile ? 1 : 2}
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
                  <DragIndicatorIcon {...listeners} {...attributes} sx={isMobile ? { fontSize: '1.2rem' } : undefined} />
                </Tooltip>
                <Box>
                  {isEdit ? (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <TextField
                        value={name}
                        inputRef={(ref) => (inputRef.current = ref)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setName(e.target.value)}
                        variant="standard"
                        size="small"
                        onKeyDown={handleKeyDown}
                        sx={isMobile ? { '.MuiInputBase-input': { fontSize: '0.85rem' } } : undefined}
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
                        variant={isMobile ? "body2" : "body1"}
                        underline="none"
                        sx={{ cursor: 'pointer' }}
                        // onClick={handleStopPropagation(handleEdit)}
                        color="text.primary"
                      >
                        {title}
                      </Link>

                      <Typography
                        variant={isMobile ? "caption" : "body2"}
                        color="text.secondary"
                        sx={isMobile ? { display: 'block', maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } : undefined}
                      >
                        {subtitle}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                {expand && section ? (
                  <Box pr={isMobile ? 0 : 4}>
                    <PageSectionMenuStack
                      hideDesktop={section?.hideDesktop}
                      hideMobile={section?.hideMobile}
                      isVisible={isVisible}
                      onAction={onAction}
                      onToggleVisibilty={handleToggleVisibility}
                    />
                  </Box>
                ) : (
                  <IconButton
                    onClick={handleOpenMenu}
                    size={isMobile ? "small" : "medium"}
                  >
                    <MoreVert fontSize={isMobile ? "small" : "medium"} />
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
        sx={(theme) => ({
          display: Boolean(activeNode) ? 'block' : 'none',
          height: 2,
          position: 'static',
          bgcolor: isOverBottom ? theme.palette.primary.main : 'rgba(0,0,0,0)',
        })}
        ref={setNodeRefDropBottom}
      />
    </>
  );
}
