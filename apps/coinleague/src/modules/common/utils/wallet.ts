import { MetaMask } from '@web3-react/metamask';
import { Connector } from '@web3-react/types';
import { MagicConnector } from '../connectors/magic';

export function getConnectorName(connector?: Connector) {
  if (connector instanceof MagicConnector) {
    return 'magic';
  } else if (connector instanceof MetaMask) {
    return 'metamask';
  }
}
