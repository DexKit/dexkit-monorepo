import { ChainId } from '@/modules/common/constants/enums';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { GameGraph } from '../types';
import GamesTableRow from './GamesTableRow';

interface Props {
  games: GameGraph[];
  onShare: (game: GameGraph) => void;
  onShowMetadata: (game: GameGraph) => void;
  chainId?: ChainId;
  affiliate?: string;
}

export default function GamesTable({
  games,
  onShare,
  onShowMetadata,
  chainId,
  affiliate,
}: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <FormattedMessage id="id" defaultMessage="ID" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="game.level" defaultMessage="Game Type" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="game.level" defaultMessage="Game Level" />
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {games.map((game, index: number) => (
          <GamesTableRow
            key={index}
            game={game}
            onShare={onShare}
            chainId={chainId}
            onShowMetadata={onShowMetadata}
            affiliate={affiliate}
          />
        ))}
      </TableBody>
    </Table>
  );
}
