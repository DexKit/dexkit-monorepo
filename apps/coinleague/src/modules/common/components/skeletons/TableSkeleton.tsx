import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { memo } from 'react';

interface Props {
  rows: number;
  cols: number;
}

function TableSkeleton({ rows, cols }: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {new Array(cols).fill(null).map((_, j: number) => (
            <TableCell key={j}></TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {new Array(rows).fill(null).map((_, i: number) => (
          <TableRow key={i}>
            {new Array(cols).fill(null).map((_, j: number) => (
              <TableCell key={j}>
                <Skeleton />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default memo(TableSkeleton);
