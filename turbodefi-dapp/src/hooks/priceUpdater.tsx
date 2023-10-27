import BigNumber from 'bignumber.js';
import { useContext, useState } from 'react';
import { UsdValueContext } from 'services';

export const usePriceUpdater = () => {
    const [price, setPrice] = useState<BigNumber>(new BigNumber(0));

    const { handleUpdateTotalUsdValue } = useContext(UsdValueContext);

    const updatePrice = (newPrice: BigNumber) => {
        handleUpdateTotalUsdValue(newPrice.minus(price));
        setPrice(newPrice);
    };
    return {price, updatePrice};
};