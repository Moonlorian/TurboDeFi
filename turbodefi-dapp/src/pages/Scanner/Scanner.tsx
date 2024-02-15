import { Button, Card, Input, OutputContainer } from 'components';
import { Fragment, useEffect, useState } from 'react';
import { ScannerTransactionRow } from './widgets';
import { getInterpretedTransaction } from '@multiversx/sdk-dapp/utils/transactions/getInterpretedTransaction';
import ScannerService from '../../services/ScannerService';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';

const COLUMNS = [
  'Project',
  'Smart Contract',
  'Action',
  'Age',
  'Asset',
  'Tx-Hash'
];

export const Scanner = () => {
  const { address } = useGetAccountInfo();

  const [transactionsList, setTransactionsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterPeriod, setFilterPeriod] = useState(0);
  const [filterAddress, setFilterAddress] = useState(address ? address : '');
  const [receiverAddress, setReceiverAddress] = useState('');

  const scannerService = new ScannerService();

  const filterOptions = [
    'Last week',
    'Last month',
    'Last year',
    'From the beginning'
  ];

  function calculateFilterDays() {
    switch (filterPeriod) {
      case 0:
        return 7;
      case 1:
        return 30;
      case 2:
        return 365;
      case 3:
        return 0;
      default:
        return 0;
    }
  }

  const getTransactionsList = async () => {
    if (filterAddress != '') {
      setIsLoading(true);

      const transactions: any[] = await scannerService.getTransactionsList({
        address: filterAddress,
        filterDays: calculateFilterDays(),
        receiver: receiverAddress
      });

      setTransactionsList(transactions);
    }
    setIsLoading(false);
  };

  const handleFilterSelect = (e: any) => {
    setFilterPeriod(parseInt(e));
    setTransactionsList([]);
  };

  const updateAddress = (newAddress: string) => {
    setFilterAddress(newAddress);
  };

  const scanAddress = () => {
    setTransactionsList([]);
    getTransactionsList();
  };

  const seeContractTransactions = (receiver: string) => {
    if (!receiverAddress) {
      setReceiverAddress(receiver);
    }
  };

  useEffect(() => {
    getTransactionsList();
  }, [filterPeriod, receiverAddress]);

  return (
    <div className='flex flex-col gap-6 max-w-7xl w-full'>
      <Card
        className='flex-2 bg-bg-color'
        key={'walletScanner'}
        title={'Wallet Scanner'}
        description={
          'Latest interactions of a wallet with different smart contracts'
        }
        reference={''}
      >
        <div className='d-flex w-full justify-content-between'>
          <div className='w-full mb-2'>
            <div className='mb-2 d-flex w-75'>
              <div className='mr-3 w-full'>
                <Input
                  placeholder='Address to scan'
                  value={`${filterAddress}`}
                  onChange={(e: any) => {
                    updateAddress(e.target.value);
                  }}
                />
              </div>
              <Button onClick={scanAddress} disabled={isLoading}>
                Scan
              </Button>
            </div>
            {receiverAddress && (
              <span className='w-50'>
                <i>Smart Contract:</i> {receiverAddress}
                <FontAwesomeIcon
                  icon={faClose}
                  className='ml-2 text-gray-700 pointer'
                  onClick={() => setReceiverAddress('')}
                />
              </span>
            )}
          </div>
          <div className='text-end mb-2'>
            <Menu as='div' className='relative inline-block text-left'>
              <div>
                <Menu.Button className='inline-flex w-full justify-center rounded-md bg-gray gap-1 px-2.5 py-2 text-md text-white shadow-sm bg-gray-500 hover:bg-gray-600 items-center whitespace-nowrap'>
                  {filterOptions[filterPeriod]}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className='text-gray-white text-sm'
                    onClick={() => setReceiverAddress('')}
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right border rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none '>
                  <div className='py-1'>
                    {filterOptions.map((option, index) => (
                      <Menu.Item key={index} disabled={isLoading}>
                        {({ active }) => (
                          <span
                            onClick={() => {
                              handleFilterSelect(index);
                            }}
                            className={classNames(
                              active ? 'hover:text-white' : '',
                              filterPeriod == index
                                ? 'text-white bg-main-color'
                                : 'text-black hover:bg-main-color/50 ',

                              'block px-4 py-2 text-decoration-none cursor-pointer'
                            )}
                          >
                            {option}
                          </span>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <OutputContainer isLoading={isLoading} className='p-0'>
          <div className='w-full h-full bg-gray-100 overflow-x-auto bg-white shadow rounded-lg'>
            <table className='w-full divide-y divide-gray-200 overflow-auto table-auto'>
              <thead className='bg-gray-50'>
                <tr>
                  {COLUMNS.map((column) => (
                    <th
                      key={column}
                      scope='col'
                      className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6'
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {transactionsList.map((transaction, index) => (
                  <ScannerTransactionRow
                    key={transaction.txHash}
                    className='mx-transactions text-gray-500'
                    transaction={getInterpretedTransaction({
                      address: '',
                      explorerAddress: '',
                      transaction
                    })}
                    receiverDetails={
                      receiverAddress === '' ? seeContractTransactions : null
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </OutputContainer>
      </Card>
    </div>
  );
};
