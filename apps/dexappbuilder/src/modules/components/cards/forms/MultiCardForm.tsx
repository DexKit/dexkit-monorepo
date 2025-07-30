import { DKMDEditorInput } from '@dexkit/ui/components';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  GridView as GridViewIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { z } from 'zod';
import { ImageGalleryPicker } from '../components/ImageGalleryPicker';
import { multiCardConfigSchema } from '../schemas';
import { CardGridItem, MultiCardConfig } from '../types/card';

function validate(values: MultiCardConfig) {
  try {
    multiCardConfigSchema.parse(values);
    return {};
  } catch (e) {
    const errors: Record<string, any> = {};
    if (e instanceof z.ZodError) {
      console.log('MultiCardForm validation errors:', e.errors);
      e.errors.forEach(err => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
    }
    return errors;
  }
}

interface MultiCardFormProps {
  initialValues: MultiCardConfig;
  onSubmit: (values: MultiCardConfig) => void;
  onChange?: (values: MultiCardConfig) => void;
}

export const MultiCardForm: React.FC<MultiCardFormProps> = ({
  initialValues,
  onSubmit,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedCard, setExpandedCard] = useState<string | false>(false);

  const formik = useFormik<MultiCardConfig>({
    initialValues: {
      cards: initialValues.cards.length > 0 ? initialValues.cards : [createNewCard()],
      gridSettings: initialValues.gridSettings,
      responsive: initialValues.responsive,
    },
    validate,
    onSubmit: (values) => {
      onSubmit(values);
    },
    enableReinitialize: true,
  });

  function createNewCard(): CardGridItem {
    const cardCount = formik.values.cards.length;
    return {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `Card ${cardCount + 1}`,
      description: '',
      image: '',
      actions: [{ label: '', href: '' }],
      layout: {
        x: (cardCount % 4) * 3,
        y: Math.floor(cardCount / 4) * 2,
        w: 3,
        h: 2,
        minW: 2,
        maxW: 6,
        minH: 2,
        maxH: 4,
      },
    };
  }

  const addCard = () => {
    const newCard = createNewCard();
    formik.setFieldValue('cards', [...formik.values.cards, newCard]);
    setExpandedCard(newCard.id);
  };

  const removeCard = (cardId: string) => {
    const updatedCards = formik.values.cards.filter(card => card.id !== cardId);
    formik.setFieldValue('cards', updatedCards);
    if (expandedCard === cardId) {
      setExpandedCard(false);
    }
  };

  const updateCard = (cardId: string, updates: Partial<CardGridItem>) => {
    const updatedCards = formik.values.cards.map(card =>
      card.id === cardId ? { ...card, ...updates } : card
    );
    formik.setFieldValue('cards', updatedCards);
  };



  const handleActionLabelChange = (cardId: string, label: string) => {
    const currentCards = formik.values.cards;
    const updatedCards = currentCards.map(card => {
      if (card.id === cardId) {
        const currentActions = card.actions || [{ label: '', href: '' }];
        const updatedActions = [
          {
            label: label,
            href: currentActions[0]?.href || ''
          }
        ];
        return { ...card, actions: updatedActions };
      }
      return card;
    });
    formik.setFieldValue('cards', updatedCards);
  };

  const handleActionHrefChange = (cardId: string, href: string) => {
    const currentCards = formik.values.cards;
    const updatedCards = currentCards.map(card => {
      if (card.id === cardId) {
        const currentActions = card.actions || [{ label: '', href: '' }];
        const updatedActions = [
          {
            label: currentActions[0]?.label || '',
            href: href
          }
        ];
        return { ...card, actions: updatedActions };
      }
      return card;
    });
    formik.setFieldValue('cards', updatedCards);
  };

  useEffect(() => {
    if (onChange) {
      onChange(formik.values);
    }
  }, [formik.values]);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
          <Tab icon={<GridViewIcon />} label={<FormattedMessage id="cards.tab.cards" defaultMessage="Cards" />} />
          <Tab icon={<SettingsIcon />} label={<FormattedMessage id="cards.tab.layout" defaultMessage="Layout Settings" />} />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <FormattedMessage id="cards.manage" defaultMessage="Manage Cards" />
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addCard}
                sx={{ mb: 1 }}
              >
                <FormattedMessage id="cards.add" defaultMessage="Add Card" />
              </Button>
            </Box>

            {formik.values.cards.map((card, index) => (
              <Accordion
                key={card.id}
                expanded={expandedCard === card.id}
                onChange={(_, isExpanded) => setExpandedCard(isExpanded ? card.id : false)}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mr: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {card.title || `Card ${index + 1}`}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCard(card.id);
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label={<FormattedMessage id="card.title" defaultMessage="Title" />}
                      value={card.title}
                      onChange={(e) => updateCard(card.id, { title: e.target.value })}
                      required
                      fullWidth
                    />
                    <DKMDEditorInput
                      label={<FormattedMessage id="card.description" defaultMessage="Description" />}
                      value={card.description || ''}
                      onChange={(value) => updateCard(card.id, { description: value })}
                      helperText={<FormattedMessage id="card.description.helper" defaultMessage="Use markdown formatting and AI assistance for rich content" />}
                      height={150}
                    />
                    <Typography variant="subtitle2">
                      <FormattedMessage id="card.image" defaultMessage="Image" />
                    </Typography>
                    <ImageGalleryPicker
                      value={card.image}
                      onChange={(url: string | null) => {
                        if (url) {
                          updateCard(card.id, { image: url, imageFile: undefined });
                        } else {
                          updateCard(card.id, { image: '', imageFile: undefined });
                        }
                      }}
                    />
                    <Typography variant="subtitle2" sx={{ mt: 2 }}>
                      <FormattedMessage id="card.action" defaultMessage="Action Button" />
                    </Typography>
                    <TextField
                      label={<FormattedMessage id="card.action.label" defaultMessage="Button Label" />}
                      value={card.actions?.[0]?.label || ''}
                      onChange={(e) => handleActionLabelChange(card.id, e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label={<FormattedMessage id="card.action.href" defaultMessage="Button Link (href)" />}
                      value={card.actions?.[0]?.href || ''}
                      onChange={(e) => handleActionHrefChange(card.id, e.target.value)}
                      fullWidth
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6">
              <FormattedMessage id="cards.layout.settings" defaultMessage="Layout Settings" />
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
              <TextField
                label={<FormattedMessage id="cards.layout.columns" defaultMessage="Columns" />}
                type="number"
                value={formik.values.gridSettings.cols}
                onChange={(e) => formik.setFieldValue('gridSettings.cols', parseInt(e.target.value))}
                inputProps={{ min: 1, max: 24 }}
              />
              <TextField
                label={<FormattedMessage id="cards.layout.rowHeight" defaultMessage="Row Height (px)" />}
                type="number"
                value={formik.values.gridSettings.rowHeight}
                onChange={(e) => formik.setFieldValue('gridSettings.rowHeight', parseInt(e.target.value))}
                inputProps={{ min: 50 }}
              />
            </Box>

            <Box>
              <Typography gutterBottom>
                <FormattedMessage id="cards.layout.margin" defaultMessage="Margin [x, y]" />
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="X"
                  type="number"
                  value={formik.values.gridSettings.margin[0]}
                  onChange={(e) => {
                    const newMargin: [number, number] = [parseInt(e.target.value), formik.values.gridSettings.margin[1]];
                    formik.setFieldValue('gridSettings.margin', newMargin);
                  }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Y"
                  type="number"
                  value={formik.values.gridSettings.margin[1]}
                  onChange={(e) => {
                    const newMargin: [number, number] = [formik.values.gridSettings.margin[0], parseInt(e.target.value)];
                    formik.setFieldValue('gridSettings.margin', newMargin);
                  }}
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>

            <FormControl>
              <InputLabel>
                <FormattedMessage id="cards.layout.compactType" defaultMessage="Compact Type" />
              </InputLabel>
              <Select
                value={formik.values.gridSettings.compactType === null ? 'null' : formik.values.gridSettings.compactType || 'vertical'}
                onChange={(e) => formik.setFieldValue('gridSettings.compactType', e.target.value === 'null' ? null : e.target.value)}
              >
                <MenuItem value="vertical">
                  <FormattedMessage id="cards.layout.compact.vertical" defaultMessage="Vertical" />
                </MenuItem>
                <MenuItem value="horizontal">
                  <FormattedMessage id="cards.layout.compact.horizontal" defaultMessage="Horizontal" />
                </MenuItem>
                <MenuItem value="null">
                  <FormattedMessage id="cards.layout.compact.none" defaultMessage="None" />
                </MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.gridSettings.isDraggable}
                    onChange={(e) => formik.setFieldValue('gridSettings.isDraggable', e.target.checked)}
                  />
                }
                label={<FormattedMessage id="cards.layout.draggable" defaultMessage="Allow Dragging" />}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.gridSettings.isResizable}
                    onChange={(e) => formik.setFieldValue('gridSettings.isResizable', e.target.checked)}
                  />
                }
                label={<FormattedMessage id="cards.layout.resizable" defaultMessage="Allow Resizing" />}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.gridSettings.allowOverlap || false}
                    onChange={(e) => formik.setFieldValue('gridSettings.allowOverlap', e.target.checked)}
                  />
                }
                label={<FormattedMessage id="cards.layout.allowOverlap" defaultMessage="Allow Overlap" />}
              />
            </Box>
          </Box>
        )}
      </Paper>

      <Button
        type="submit"
        variant="contained"
        size="large"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={formik.isSubmitting || !formik.isValid}
      >
        <FormattedMessage id="cards.save" defaultMessage="Save Configuration" />
      </Button>
    </Box>
  );
};
