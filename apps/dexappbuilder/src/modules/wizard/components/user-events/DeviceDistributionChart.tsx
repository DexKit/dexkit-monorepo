import { CountFilter } from '@dexkit/ui/hooks/userEvents';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface DeviceData {
  name: string;
  value: number;
  color: string;
}

interface DeviceDistributionChartProps {
  filters?: CountFilter;
}

export default function DeviceDistributionChart({ filters }: DeviceDistributionChartProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DeviceData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // TODO: ENDPOINT - Replace with real API call
        // Suggested endpoint: GET /api/user-events/device-distribution
        // Parameters: 
        // - siteId: site ID
        // - start: start date (filters.start)
        // - end: end date (filters.end)
        // - from: optional origin address (filters.from)
        // - referral: optional reference (filters.referral)
        // - chainId: optional chain ID (filters.chainId)
        //
        // Expected response:
        // [
        //   { name: "Desktop", value: 45 },
        //   { name: "Mobile", value: 35 },
        //   { name: "Tablet", value: 20 }
        // ]
        
        // Simulation of data for device distribution
        // In a real implementation, this data would come from the API
        
        // Generate random values for distribution
        const total = 100;
        const desktopPercentage = Math.floor(Math.random() * 40) + 30; // 30-70%
        const mobilePercentage = Math.floor(Math.random() * 30) + 20; // 20-50%
        const tabletPercentage = total - desktopPercentage - mobilePercentage;
        
        setData([
          {
            name: 'Desktop',
            value: desktopPercentage,
            color: theme.palette.primary.main
          },
          {
            name: 'Mobile',
            value: mobilePercentage,
            color: theme.palette.secondary.main
          },
          {
            name: 'Tablet',
            value: tabletPercentage,
            color: theme.palette.success.main
          }
        ]);
      } catch (error) {
        console.error('Error generating example data for devices:', error);
        
        // Fallback data in case of error
        setData([
          { name: 'Desktop', value: 55, color: theme.palette.primary.main },
          { name: 'Mobile', value: 35, color: theme.palette.secondary.main },
          { name: 'Tablet', value: 10, color: theme.palette.success.main }
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
    <Box sx={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={50}
            innerRadius={0}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name.charAt(0)}: ${value}%`}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Percentage']}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            iconSize={8}
            fontSize={10}
            wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
} 