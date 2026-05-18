import { useWhitelabelTemplateSitesListQuery } from '../../../../hooks/whitelabel';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
  dialogProps: DialogProps;
  onSelectTemplate: (appConfig: AppConfig) => void;
}

export default function VibecoderTemplateSelector({
  dialogProps,
  onSelectTemplate,
}: Props) {
  const { onClose } = dialogProps;
  const { formatMessage } = useIntl();
  const [searchQuery, setSearchQuery] = useState('');
  
  const templatesQuery = useWhitelabelTemplateSitesListQuery({});

  const filteredTemplates = useMemo(() => {
    if (!templatesQuery.data) return [];
    
    let filtered = [...templatesQuery.data];
    
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.metadata?.title?.toLowerCase().includes(searchLower) ||
        template.metadata?.subtitle?.toLowerCase().includes(searchLower) ||
        template.metadata?.usecases?.some(usecase =>
          usecase.toLowerCase().includes(searchLower)
        )
      );
    }
    
    return filtered;
  }, [templatesQuery.data, searchQuery]);

  const handleSelectTemplate = async (template: any) => {
    try {
      // TODO: load real appConfig from template
      const appConfig: AppConfig = {
        name: template.metadata?.title || 'Template App',
        locale: 'en',
        theme: 'default',
        domain: '',
        email: '',
        currency: 'USD',
        pages: {
          home: {
            title: 'Home',
            key: 'home',
            uri: '/',
            sections: [],
          },
        },
      };
      
      onSelectTemplate(appConfig);
      if (onClose) {
        onClose({}, 'backdropClick');
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog
      {...dialogProps}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
        },
      }}
    >
      <DialogTitle>
        <FormattedMessage
          id="vibecoder.select.template"
          defaultMessage="Select a Template"
        />
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ height: '100%' }}>
          <TextField
            fullWidth
            placeholder={formatMessage({
              id: 'vibecoder.search.templates',
              defaultMessage: 'Search templates...',
            })}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />

          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {templatesQuery.isLoading ? (
              <Grid container spacing={2}>
                {[1, 2, 3, 4].map((i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Skeleton variant="rectangular" height={200} />
                    <Skeleton height={40} />
                    <Skeleton height={20} />
                  </Grid>
                ))}
              </Grid>
            ) : filteredTemplates.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 200,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage
                    id="vibecoder.no.templates"
                    defaultMessage="No templates found"
                  />
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredTemplates.map((template) => (
                  <Grid item xs={12} sm={6} md={4} key={template.id}>
                    <Card>
                      <CardActionArea onClick={() => handleSelectTemplate(template)}>
                        {template.previewUrl && (
                          <CardMedia
                            component="img"
                            height="140"
                            image={template.previewUrl}
                            alt={template.metadata?.title || 'Template'}
                          />
                        )}
                        <CardContent>
                          <Typography variant="h6" gutterBottom noWrap>
                            {template.metadata?.title || 'Untitled Template'}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 1,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {template.metadata?.subtitle || ''}
                          </Typography>
                          {template.metadata?.usecases && template.metadata.usecases.length > 0 && (
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                              {template.metadata.usecases.slice(0, 3).map((usecase, index) => (
                                <Chip
                                  key={index}
                                  label={usecase}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Stack>
                          )}
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleClose}>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                const emptyConfig: AppConfig = {
                  name: 'New App',
                  locale: 'en',
                  theme: 'default',
                  domain: '',
                  email: '',
                  currency: 'USD',
                  pages: {
                    home: {
                      title: 'Home',
                      key: 'home',
                      uri: '/',
                      sections: [],
                    },
                  },
                };
                onSelectTemplate(emptyConfig);
                handleClose();
              }}
            >
              <FormattedMessage
                id="vibecoder.start.from.scratch"
                defaultMessage="Start from Scratch"
              />
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

