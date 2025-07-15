import { Button, CardActions, CardContent, CardMedia, Card as MuiCard, Typography } from '@mui/material';
import React from 'react';

export interface CardAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface CardProps {
  title: string;
  description?: string;
  image?: string;
  actions?: CardAction[];
  sx?: object;
}

const Card: React.FC<CardProps> = ({ title, description, image, actions, sx }) => {
  return (
    <MuiCard
      sx={{
        maxWidth: 345,
        minWidth: 260,
        m: 'auto',
        boxShadow: 3,
        borderRadius: 3,
        p: 0,
        ...sx,
      }}
    >
      {image && (
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={title}
          sx={{ objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        />
      )}
      <CardContent sx={{ pb: 1.5 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 700, mb: 0.5 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {description}
          </Typography>
        )}
      </CardContent>
      {actions && actions.length > 0 && actions[0].label && (
        <CardActions sx={{ pt: 0, pb: 2, px: 2 }}>
          {actions.map((action, idx) =>
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
              <Button key={idx} size="medium" variant="contained" color="primary" fullWidth onClick={action.onClick} sx={{ fontWeight: 600 }}>
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