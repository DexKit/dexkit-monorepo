import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import {
  Card,
  CardActionArea,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import { useIsMobile } from '@dexkit/core';
import ContentCopyIcon from '@mui/icons-material/ContentCopyOutlined';
import LinkOutlined from '@mui/icons-material/LinkOutlined';
import LockIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import { FormattedMessage } from 'react-intl';

import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import React, { MouseEvent } from 'react';

export interface PageProps {
  page: AppPage;
  pageKey: string;
  onSelect: () => void;
  onPreview: () => void;
  onClone: () => void;
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
  onEditConditions,
  pageKey,
  previewUrl,
}: PageProps) {
  const handleMouseDown: any = (e: MouseEvent) => e.stopPropagation();
  const isMobile = useIsMobile();

  const handleAction = (callback: () => void) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      callback();
    };
  };

  return (
    <Card>
      <CardActionArea sx={{ px: isMobile ? 1 : 2, py: isMobile ? 0.5 : 1 }} onClick={onSelect}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction="row"
        >
          <Typography variant={isMobile ? "body2" : "body1"} color="text.primary">
            {page.title}
          </Typography>
          <Stack
            alignItems="center"
            justifyContent="center"
            direction="row"
            mr={{ sm: 4, xs: 0 }}
            spacing={isMobile ? 0 : 1}
          >
            <IconButton
              onClick={handleAction(onPreview)}
              onMouseDown={handleMouseDown}
              size={isMobile ? "small" : "medium"}
              sx={{ p: isMobile ? 0.5 : 1 }}
            >
              <Tooltip
                title={
                  <FormattedMessage
                    id="preview.page"
                    defaultMessage="Preview page"
                  />
                }
              >
                <Visibility fontSize={isMobile ? "small" : "medium"} />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={handleAction(onClone)}
              size={isMobile ? "small" : "medium"}
              sx={{ p: isMobile ? 0.5 : 1 }}
            >
              <Tooltip
                title={
                  <FormattedMessage
                    id="clone.page"
                    defaultMessage="Clone Page"
                  />
                }
              >
                <ContentCopyIcon fontSize={isMobile ? "small" : "medium"} />
              </Tooltip>
            </IconButton>
            <IconButton
              onMouseDown={handleMouseDown}
              LinkComponent={Link}
              onClick={(e) => e.stopPropagation()}
              href={`${previewUrl}/${pageKey}`}
              target="_blank"
              size={isMobile ? "small" : "medium"}
              sx={{ p: isMobile ? 0.5 : 1 }}
            >
              <Tooltip
                title={
                  <FormattedMessage
                    id="open.url.alt"
                    defaultMessage="Open URL"
                  />
                }
              >
                <LinkOutlined fontSize={isMobile ? "small" : "medium"} />
              </Tooltip>
            </IconButton>
            {pageKey !== 'home' && (
              <IconButton
                onClick={handleAction(onEditConditions)}
                color={
                  page.enableGatedConditions === true ? 'success' : undefined
                }
                size={isMobile ? "small" : "medium"}
                sx={{ p: isMobile ? 0.5 : 1 }}
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
                  <LockIcon fontSize={isMobile ? "small" : "medium"} />
                </Tooltip>
              </IconButton>
            )}

            <IconButton
              onClick={handleAction(onRemove)}
              size={isMobile ? "small" : "medium"}
              sx={{ p: isMobile ? 0.5 : 1 }}
            >
              <Tooltip
                title={<FormattedMessage id="Delete" defaultMessage="Delete" />}
              >
                <DeleteOutlined fontSize={isMobile ? "small" : "medium"} color="error" />
              </Tooltip>
            </IconButton>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
