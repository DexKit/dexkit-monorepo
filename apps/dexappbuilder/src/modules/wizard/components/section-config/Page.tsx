import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import {
  Card,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

import { useIsMobile } from '@dexkit/core';
import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import LinkOutlined from '@mui/icons-material/LinkOutlined';
import LockIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import React, { MouseEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import { CORE_PAGES_KEYS } from '../../constants';

export interface PageProps {
  page: AppPage;
  pageKey: string;
  onSelect: () => void;
  onPreview: () => void;
  onClone: () => void;
  onEmbed: () => void;
  onRemove: () => void;
  onEditConditions: () => void;
  previewUrl?: string;
}

export default function Page({
  page,
  onSelect,
  onPreview,
  onRemove,
  onClone,
  onEmbed,
  onEditConditions,
  pageKey,
  previewUrl,
}: PageProps) {
  const handleMouseDown: any = (e: MouseEvent) => e.stopPropagation();
  const isMobile = useIsMobile();
  const theme = useTheme();

  const handleAction = (callback: () => void) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      callback();
    };
  };

  return (
    <Card
      sx={{ width: isMobile ? `calc(100% - ${theme.spacing(1)})` : '100%' }}
    >
      <div
        style={{
          cursor: 'pointer',
          paddingLeft: isMobile ? theme.spacing(1) : theme.spacing(2),
          paddingRight: isMobile ? theme.spacing(1) : theme.spacing(2),
          paddingTop: isMobile ? theme.spacing(1.5) : theme.spacing(1),
          paddingBottom: isMobile ? theme.spacing(1.5) : theme.spacing(1),
        }}
        onClick={onSelect}
      >
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction="row"
        >
          <Typography
            variant={isMobile ? 'body1' : 'body1'}
            color="text.primary"
            sx={{
              fontWeight: isMobile
                ? theme.typography.fontWeightMedium
                : theme.typography.fontWeightRegular,
              fontSize: isMobile ? theme.typography.body2.fontSize : undefined,
            }}
          >
            {page.title}
          </Typography>
          <Stack
            alignItems="center"
            justifyContent="center"
            direction="row"
            mr={{ sm: theme.spacing(4), xs: 0 }}
            spacing={isMobile ? 0 : theme.spacing(1)}
          >
            <IconButton
              onClick={handleAction(onPreview)}
              onMouseDown={handleMouseDown}
              size={isMobile ? 'small' : 'medium'}
              sx={{ p: isMobile ? theme.spacing(0.75) : theme.spacing(1) }}
            >
              <Tooltip
                title={
                  <FormattedMessage
                    id="preview.page"
                    defaultMessage="Preview page"
                  />
                }
              >
                <Visibility fontSize={isMobile ? 'medium' : 'medium'} />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={handleAction(onClone)}
              size={isMobile ? 'small' : 'medium'}
              sx={{ p: isMobile ? theme.spacing(0.75) : theme.spacing(1) }}
            >
              <Tooltip
                title={
                  <FormattedMessage
                    id="clone.page"
                    defaultMessage="Clone Page"
                  />
                }
              >
                <ContentCopyIcon fontSize={isMobile ? 'medium' : 'medium'} />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={handleAction(onEmbed)}
              size={isMobile ? 'small' : 'medium'}
              sx={{ p: isMobile ? theme.spacing(0.75) : theme.spacing(1) }}
            >
              <Tooltip
                title={
                  <FormattedMessage
                    id="embed.code"
                    defaultMessage="Embed code"
                  />
                }
              >
                <CodeIcon fontSize={isMobile ? 'medium' : 'medium'} />
              </Tooltip>
            </IconButton>
            <IconButton
              onMouseDown={handleMouseDown}
              LinkComponent={Link}
              onClick={(e: any) => e.stopPropagation()}
              href={`${previewUrl}/${pageKey}`}
              target="_blank"
              size={isMobile ? 'small' : 'medium'}
              sx={{ p: isMobile ? theme.spacing(0.75) : theme.spacing(1) }}
            >
              <Tooltip
                title={
                  <FormattedMessage
                    id="open.url.alt"
                    defaultMessage="Open URL"
                  />
                }
              >
                <LinkOutlined fontSize={isMobile ? 'medium' : 'medium'} />
              </Tooltip>
            </IconButton>
            {!CORE_PAGES_KEYS.includes(pageKey) && (
              <IconButton
                onClick={handleAction(onEditConditions)}
                color={
                  page.enableGatedConditions === true ? 'success' : undefined
                }
                size={isMobile ? 'small' : 'medium'}
                sx={{ p: isMobile ? theme.spacing(0.75) : theme.spacing(1) }}
              >
                <Tooltip
                  title={
                    page.enableGatedConditions === true ? (
                      <FormattedMessage
                        id="page.protected.enabled"
                        defaultMessage="Page protected enabled"
                      />
                    ) : (
                      <FormattedMessage
                        id="add.gated.conditions"
                        defaultMessage="Add Gated Conditions"
                      />
                    )
                  }
                >
                  <LockIcon fontSize={isMobile ? 'medium' : 'medium'} />
                </Tooltip>
              </IconButton>
            )}

            {!CORE_PAGES_KEYS.includes(pageKey) && (
              <IconButton
                onClick={handleAction(onRemove)}
                size={isMobile ? 'small' : 'medium'}
                sx={{ p: isMobile ? theme.spacing(0.75) : theme.spacing(1) }}
              >
                <Tooltip
                  title={
                    <FormattedMessage id="Delete" defaultMessage="Delete" />
                  }
                >
                  <DeleteOutlined
                    fontSize={isMobile ? 'medium' : 'medium'}
                    color="error"
                  />
                </Tooltip>
              </IconButton>
            )}
          </Stack>
        </Stack>
      </div>
    </Card>
  );
}
