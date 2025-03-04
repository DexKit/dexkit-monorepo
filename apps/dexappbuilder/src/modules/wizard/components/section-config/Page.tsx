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

  const handleAction = (callback: () => void) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();

      callback();
    };
  };

  return (
    <Card>
      <CardActionArea sx={{ px: 2, py: 1 }} onClick={onSelect}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction="row"
        >
          <Typography variant="body1" color="text.primary">
            {page.title}
          </Typography>
          <Stack
            alignItems="center"
            justifyContent="center"
            direction="row"
            mr={{ sm: 4, xs: 0 }}
            spacing={1}
          >
            <IconButton
              onClick={handleAction(onPreview)}
              onMouseDown={handleMouseDown}
            >
              <Tooltip
                title={
                  <FormattedMessage
                    id="preview.page"
                    defaultMessage="Preview page"
                  />
                }
              >
                <Visibility />
              </Tooltip>
            </IconButton>
            <IconButton onClick={handleAction(onClone)}>
              <Tooltip
                title={
                  <FormattedMessage
                    id="clone.page"
                    defaultMessage="Clone Page"
                  />
                }
              >
                <ContentCopyIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              onMouseDown={handleMouseDown}
              LinkComponent={Link}
              onClick={(e) => e.stopPropagation()}
              href={`${previewUrl}/${pageKey}`}
              target="_blank"
            >
              <Tooltip
                title={
                  <FormattedMessage
                    id="open.url.alt"
                    defaultMessage="Open URL"
                  />
                }
              >
                <LinkOutlined />
              </Tooltip>
            </IconButton>
            {pageKey !== 'home' && (
              <IconButton
                onClick={handleAction(onEditConditions)}
                color={
                  page.enableGatedConditions === true ? 'success' : undefined
                }
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
                  <LockIcon />
                </Tooltip>
              </IconButton>
            )}

            <IconButton onClick={handleAction(onRemove)}>
              <Tooltip
                title={<FormattedMessage id="Delete" defaultMessage="Delete" />}
              >
                <DeleteOutlined color="error" />
              </Tooltip>
            </IconButton>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
