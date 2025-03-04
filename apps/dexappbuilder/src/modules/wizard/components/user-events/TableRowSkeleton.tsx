import { Skeleton, TableCell, TableRow } from '@mui/material';

export interface TableRowSkeletonProps {
  cells: number;
}

export default function TableRowSkeleton({ cells }: TableRowSkeletonProps) {
  return (
    <TableRow>
      {new Array(cells).fill(null).map((cell, index) => (
        <TableCell key={index}>
          <Skeleton />
        </TableCell>
      ))}
    </TableRow>
  );
}
