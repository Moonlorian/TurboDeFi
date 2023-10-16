import React, { Fragment, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { getDelegated } from 'services';
import { Label } from 'components/Label';
import { FormatAmount } from '@multiversx/sdk-dapp/UI';
import { useGetTokenInfo } from 'hooks';
import { Card } from 'components/Card';
import { Button } from 'components/Button';

export const StakeInfo = () => {
  type stakedInfoType = {
    address: string;
    contract: string;
    userUnBondable: BigNumber;
    userActiveStake: BigNumber;
    claimableRewards: BigNumber;
    userUndelegatedList: [
      {
        amount: BigNumber;
        seconds: number;
      }
    ];
  };
  const [stakedInfo, setStakedInfo] = useState<stakedInfoType[]>([]);
  const egldId = 'EGLD';
  const tokenInfo = useGetTokenInfo();
  const { address } = useGetAccountInfo();

  const loadStakedInfo = async () => {
    const delegatedList = await getDelegated(address);
    return delegatedList;
  };

  useEffect(() => {
    loadStakedInfo().then((delegatedList: stakedInfoType[]) => {
      setStakedInfo(
        delegatedList.filter((staked) =>
          staked.userActiveStake.isGreaterThan(0)
        )
      );
    });
  }, []);
  return (
    <Card
      className='flex flex-col gap-6 max-w-7xl w-full'
      key={'staked'}
      title={'Staked'}
      description={'EGLDs staked'}
      reference={''}
    >
      {stakedInfo.map((staked, index) => (
        <Fragment key={index}>
         <div className='flex'>
            <Label>Staked: </Label>
            <FormatAmount
              value={staked.userActiveStake.toFixed()}
              decimals={tokenInfo.get(egldId, 'decimals')}
              digits={4}
              showLabel={true}
            />
          </div>
          <div className='flex'>
            <Label>Pending rewards: </Label>
            <FormatAmount
              value={staked.claimableRewards.toFixed()}
              decimals={tokenInfo.get(egldId, 'decimals')}
              digits={4}
              showLabel={true}
            />
          </div>
          {staked.claimableRewards.isGreaterThan(0) && (
            <div>
              <Button className='me-2' onClick={() => {}}>
                Claim
              </Button>
              <Button onClick={() => {}}>Reinvest</Button>
            </div>
          )}
        </Fragment>
      ))}
    </Card>
  );
};
