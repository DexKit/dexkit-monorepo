import { Button, CardActions, CardContent, CardMedia, Card as MuiCard, Typography } from '@mui/material';
import { MarkdownRenderer } from '@dexkit/ui/components';
import React from 'react';

export interface CardAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface CardProps {
  id?: string;
  title: string;
  description?: string;
  image?: string;
  actions?: CardAction[];
  sx?: object;
}

const Card: React.FC<CardProps> = ({ id, title, description, image, actions, sx }: any) => {
  return (
    <MuiCard
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        borderRadius: 3,
        overflow: 'hidden',
        ...sx,
      }}
    >
      {image && (
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, pb: 1.5 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 700, mb: 0.5 }}>
          {title}
        </Typography>
        {description && (
          <MarkdownRenderer 
            content={description} 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 1 }} 
          />
        )}
      </CardContent>
      {actions && actions.length > 0 && actions.some((action: any) => action.label) && (
        <CardActions sx={{ pt: 0, pb: 2, px: 2, mt: 'auto' }}>
          {actions.map((action: any, idx: any) =>
            action.href ? (
              <Button
                key={idx}
                size="medium"
                variant="contained"
                color="primary"
                fullWidth
                component="a"
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontWeight: 600 }}
              >
                {action.label}
              </Button>
            ) : (
              <Button 
                key={idx} 
                size="medium" 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={action.onClick} 
                sx={{ fontWeight: 600 }}
              >
                {action.label}
              </Button>
            )
          )}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;
