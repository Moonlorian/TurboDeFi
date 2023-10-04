import { Card, OutputContainer } from 'components';
import { useEffect, useState } from 'react';
import { getApiFullGeneric } from 'services/apiQueries';
import { ScannerTransactionRow } from './widgets';
import { getInterpretedTransaction } from '@multiversx/sdk-dapp/utils/transactions/getInterpretedTransaction';
import { Button, Dropdown, Form } from 'react-bootstrap';

const COLUMNS = ['TxHash', 'To', 'Age', 'Method', 'Value'];

export const Scanner = () => {
    const [filteredTransactionsList, setFilteredTransactionsList] = useState<
        any[]
    >([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState(0);
    const [address, setAddress] = useState("erd14ntdu7kv44dztem5zluu934ekcj9sqmnmadl3zj7sxhjq6pyut6szd4dhv");

    const filterOptions = [
        "Last week",
        "Last month",
        "Last year",
        "From the beginning"
    ]

    const transactionFields = [
        "txHash",
        "receiver",
        "timestamp",
        "function",
        "receiverAssets",
        "action",
        "value",
        "data",
        "status",
        "sender"
    ];

    const getFilterTimestamp = () => {
        let days = 0;
        switch (filter) {
            case 0:
                days = 7;
                break;
            case 1:
                days = 30;
                break;
            case 2:
                days = 365;
                break;
            case 3:
                break;
        }

        if (days > 0) {
            let now = new Date();
            return Math.floor((now.getTime() - (days * 1000 * 60 * 60 * 24)) / 1000);
        } else {
            return 0
        }
    }

    const getTransactionsList = async () => {
        setIsLoading(true);
        const timestamp = getFilterTimestamp();
        const list = await getApiFullGeneric(
            `transactions?sender=${address}&fields=${transactionFields.toString()}${timestamp > 0 ? `&after=${timestamp}` : ''}`,
            { pageSize: 10000 }
        );

        const receiversList: string[] = [];
        const filteredList = list.filter((transaction) => {
            const receiver = transaction.receiver;
            if (!receiver.includes('qqqqq') && receiver != address) {
                return false;
            }
            if (!receiversList.includes(receiver) || receiver == address) {
                receiversList.push(receiver);
                return true;
            }
            return false;
        });
        setFilteredTransactionsList(filteredList);
        setIsLoading(false);
    };

    const handleFilterSelect = (e: any) => {
        setFilter(parseInt(e));
        setFilteredTransactionsList([]);
    }

    const updateAddress = (newAddress: string) => {
        setAddress(newAddress);
    }

    const scanAddress = () => {
        getTransactionsList();
    }

    useEffect(() => {
        getTransactionsList();
    }, [filter]);

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
                                {filterOptions[filter]}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {filterOptions.map((option, index) => (
                                    <Dropdown.Item
                                        eventKey={index}
                                        key={index}
                                        active={filter == index}
                                        disabled={isLoading}
                                    >
                                        {option}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
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
                                {filteredTransactionsList.map((transaction, index) => (
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
                    </div>
                </OutputContainer>
            </Card>
        </div >
    );
};
