import * as React from 'react';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import { ExplorerLink } from '@multiversx/sdk-dapp/UI';

export const FormatedAddress = ({ address }: { address: string }) => {
  const cutWallet = (wallet: string) =>
    wallet.substring(0, 8) +
    '...' +
    wallet.substring(wallet.length - 8, wallet.length);
  return (
    <span data-testid='accountAddress' className='me-1'>
      {' '}
      {cutWallet(address)}{' '}
      <CopyButton
        text={address}
        className="className='d-block p-1 hover:bg-main-color/70 hover:text-white hover:rounded-lg px-[0.5rem] py-2"
      />{' '}
    </span>
  );
};
