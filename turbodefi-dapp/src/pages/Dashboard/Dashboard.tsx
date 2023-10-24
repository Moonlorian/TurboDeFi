import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { Disclosure } from '@headlessui/react';
import { ActionButtonList, BalancePanel, Card } from 'components';
import { useEffect } from 'react';
import { useGetPendingTransactions } from '@multiversx/sdk-dapp/hooks';
import { useGetTokenUSDPrices, useGetTokensBalanceInfo } from 'hooks';

export const Dashboard = () => {
  const { hasPendingTransactions } = useGetPendingTransactions();
  const tokensBalance = useGetTokensBalanceInfo();
  const tokensPrice = useGetTokenUSDPrices();

  useEffect(() => {
    if (Object.keys(tokensBalance.tokensBalance).length === 0) return;
    tokensPrice.loadPrices(Object.keys(tokensBalance.tokensBalance));
  }, [hasPendingTransactions, tokensBalance.tokensBalance]);
  return (
    <div className='flex flex-col gap-6 max-w-7xl w-full'>
      <div className='flex flex-col rounded-xl bg-white py-6 px-[4%] md:px-6 flex-2'>
        <Card className='flex-2 w-full position-relative' title='My Dashboard'>
          <Disclosure defaultOpen={true}>
            {({ open }) => (
              <>
                <ActionButtonList className='top-[0.3%] sm:top-[10px] right-[0.5%]'>
                  <Disclosure.Button
                    className={`bg-transparent inline-block rounded-lg px-[1rem] py-2 text-center hover:no-underline my-0 text-main-color hover:bg-main-color/80 hover:text-white mr-0 disabled:bg-main-color/20 disabled:text-black disabled:cursor-not-allowed`}
                  >
                    <FontAwesomeIcon
                      icon={open ? faChevronUp : faChevronDown}
                    />
                  </Disclosure.Button>
                </ActionButtonList>
                <Disclosure.Panel className=''>
                  {/* TODO LOAD HERE ALL USER PANELS IN DASHBOARD */}
                  <BalancePanel />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </Card>
      </div>
    </div>
  );
};
