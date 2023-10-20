import { useGetAccountInfo, useGetPendingTransactions } from '@multiversx/sdk-dapp/hooks';
import { Card } from 'components/Card';
import { Spinner } from 'components/Spinner';
import { API_URL, defaultBalanceTokens } from 'config';
import { useGetTokensBalanceInfo } from 'hooks';
import React, { useEffect, useState } from 'react';
import TurbodefiContractService from 'services/TurbodefiContractService';

export const TokensFIlter = () => {
    const [loadingTokens, setLoadingTokens] = useState(true);
    const [userTokens, setUserTokens] = useState<string[]>([]);

    const { address } = useGetAccountInfo();
    const { hasPendingTransactions } = useGetPendingTransactions();
    const tokensBalance = useGetTokensBalanceInfo();

    const loadUserSelectedTokens = async () => {
        const userSelectedTokens:string[] = await new TurbodefiContractService(API_URL).getUserSelectedTokens(address);
        setUserTokens(userSelectedTokens.length ? userSelectedTokens : defaultBalanceTokens );
        setLoadingTokens(false);
    };

    useEffect(() => {
        setLoadingTokens(true);
        if (!tokensBalance.tokensBalance.length) return;
        loadUserSelectedTokens();
    }, [hasPendingTransactions, tokensBalance.tokensBalance]);

    return(
        <Card className="border" title='Balance' reference=''>
            {loadingTokens ? (
                <Spinner color={'main-color'} msg='Loading balance...' />
            ):(
                <p>there will be token list</p>
            )}
        </Card>

    );

};