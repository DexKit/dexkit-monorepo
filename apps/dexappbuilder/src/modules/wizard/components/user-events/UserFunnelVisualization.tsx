import { CountFilter } from '@dexkit/ui/hooks/userEvents';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { Cell, Funnel, FunnelChart, LabelList, ResponsiveContainer, Tooltip } from 'recharts';

interface FunnelData {
  name: string;
  value: number;
  fill: string;
}

interface UserFunnelVisualizationProps {
  siteId?: number;
  filters?: CountFilter;
}

export default function UserFunnelVisualization({ siteId, filters }: UserFunnelVisualizationProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FunnelData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulation of data for the conversion funnel
        // In a real implementation, this data would come from the API
        
        // Example values for the conversion funnel
        setData([
          {
            name: 'Visitors',
            value: 1200,
            fill: theme.palette.primary.main
          },
          {
            name: 'Interactions',
            value: 800,
            fill: theme.palette.secondary.main
          },
          {
            name: 'Wallet Connection',
            value: 400,
            fill: theme.palette.success.main
          },
          {
            name: 'Transactions',
            value: 120,
            fill: theme.palette.warning.main
          },
          {
            name: 'Recurring Users',
            value: 45,
            fill: theme.palette.info.main
          }
        ]);
      } catch (error) {
        console.error('Error generating example data for the funnel:', error);
        
        // Fallback data in case of error
        setData([
          { name: 'Visitors', value: 1000, fill: theme.palette.primary.main },
          { name: 'Interactions', value: 600, fill: theme.palette.secondary.main },
          { name: 'Wallet Connection', value: 300, fill: theme.palette.success.main },
          { name: 'Transactions', value: 80, fill: theme.palette.warning.main },
          { name: 'Recurring Users', value: 30, fill: theme.palette.info.main }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, theme]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip formatter={(value: number) => [value, 'Users']} />
          <Funnel
            dataKey="value"
            data={data}
            isAnimationActive
          >
            <LabelList position="right" dataKey="name" fill="#000" stroke="none" />
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </Box>
  );
} 