import React from "react";

import BigNumber from 'bignumber.js';

const UsdValueContext = React.createContext(new BigNumber(0));

export default UsdValueContext;