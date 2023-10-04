import { Card, OutputContainer } from 'components';
import { useEffect, useState } from 'react';
import { ScannerTransactionRow } from './widgets';
import { getInterpretedTransaction } from '@multiversx/sdk-dapp/utils/transactions/getInterpretedTransaction';
import { Button, Dropdown, Form } from 'react-bootstrap';
import ScannerService from '../../services/ScannerService';

const COLUMNS = ['TxHash', 'To', 'Age', 'Method', 'Value'];

export const Scanner = () => {
    const [transactionsList, setTransactionsList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filterPeriod, setFilterPeriod] = useState(0);
    const [address, setAddress] = useState("");

    const scannerService = new ScannerService();

    const filterOptions = [
        "Last week",
        "Last month",
        "Last year",
        "From the beginning"
    ]

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
        setIsLoading(true);

        const transactions: any[] = await scannerService.getTransactionsList({ address: address, filterDays: calculateFilterDays() });

        setTransactionsList(transactions);
        setIsLoading(false);
    }

    const handleFilterSelect = (e: any) => {
        setFilterPeriod(parseInt(e));
        setTransactionsList([]);
    }

    const updateAddress = (newAddress: string) => {
        setAddress(newAddress);
    }

    const scanAddress = () => {
        getTransactionsList();
    }

    useEffect(() => {
        getTransactionsList();
    }, [filterPeriod]);

    const ScannerFilter = () => {
        return (
            <div className='d-flex w-100 justify-content-between'>
                <Form className='mb-2 d-flex w-75'>
                    <Form.Group className='mr-3 w-100'>
                        <Form.Control
                            placeholder='Address'
                            value={`${address}`}
                            onChange={(e: any) => {
                                updateAddress(e.target.value);
                            }}
                        />
                    </Form.Group>
                    <Button onClick={scanAddress} disabled={isLoading}>Scan</Button>
                </Form>
                <div className='text-end mb-2'>
                    <Dropdown onSelect={handleFilterSelect}>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            {filterOptions[filterPeriod]}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {filterOptions.map((option, index) => (
                                <Dropdown.Item
                                    eventKey={index}
                                    key={index}
                                    active={filterPeriod == index}
                                    disabled={isLoading}
                                >
                                    {option}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        );
    };

    const TransactionsTable = () => {
        return (
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
                        />
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <div className='flex flex-col gap-6 max-w-7xl w-full'>
            <Card
                className='flex-2'
                key={'walletScanner'}
                title={'Wallet Scanner'}
                description={
                    'Latest interactions of a wallet with different smart contracts'
                }
                reference={''}
            >
                <ScannerFilter />
                <OutputContainer isLoading={isLoading} className='p-0'>
                    <div className='w-full h-full bg-gray-100 overflow-x-auto bg-white shadow rounded-lg'>
                        <TransactionsTable />
                    </div>
                </OutputContainer>
            </Card>
        </div >
    );
};
