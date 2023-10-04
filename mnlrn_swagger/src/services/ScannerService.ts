import { getApiFullGeneric } from './apiQueries';

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

interface Transaction {
    txHash: any,
    receiver: any,
    timestamp: any,
    function: any,
    receiverAssets: any,
    action: any,
    value: any,
    data: any,
    status: any,
    sender: any
}

class ScannerService {

    async getTransactionsList({ address, filterDays }: { address: string, filterDays: number }): Promise<Array<any>> {
        const timestamp = this.calculateFilterTimestamp(filterDays);
        const list: Transaction[] = await getApiFullGeneric(
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

        return filteredList;
    }

    private calculateFilterTimestamp(days: number): number {
        if (days > 0) {
            let now = new Date();
            return Math.floor((now.getTime() - (days * 1000 * 60 * 60 * 24)) / 1000);
        } else {
            return 0
        }
    }
}

export default ScannerService;