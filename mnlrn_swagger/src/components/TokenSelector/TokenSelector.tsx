import React, { useEffect, useMemo, useRef, useState } from 'react';

import './TokenSelector.css';
import { useGetTokenInfo } from 'hooks';

const Icon = () => {
  return (
    <svg height='20' width='20' viewBox='0 0 20 20'>
      <path d='M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z'></path>
    </svg>
  );
};

export const TokenSelector = ({
  onChange,
  placeHolder = '',
  isSearchable = true
}: {
  onChange: any;
  placeHolder?: string;
  isSearchable?: boolean;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const tokenInfo = useGetTokenInfo();

  useEffect(() => {
    setSearchValue('');
  }, [showMenu]);

  const handleInputClick = (e: any) => {
    setShowMenu(!showMenu);
  };

  const getDisplay = () => {
    if (!selectedValue) {
      return placeHolder;
    }
    return selectedValue;
  };

  const onItemClick = (option: any) => {
    let newValue = option;
    setSelectedValue(newValue);
    onChange(newValue);
    handleInputClick(option);
  };

  const isSelected = (option: any) => {
    if (!selectedValue) {
      return false;
    }
    return selectedValue === option.value;
  };

  const onSearch = (e: any) => {
    setSearchValue(e.target.value);
  };

  const getOptions = useMemo(() => {
    const tokenList = tokenInfo.getList();

    if (!searchValue) {
      return tokenList;
    }

    return tokenList.filter(
      (option: any) =>
        option.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 ||
        option.ticker.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
    );
  }, [tokenInfo.getList, searchValue]);

  return (
    <div className='token-selector-container'>
      <div onClick={handleInputClick} className='token-selector-input'>
        <div className='token-selector-selected-value'>{getDisplay()}</div>
        <div className='token-selector-tools'>
          <div className='token-selector-tool'>
            <Icon />
          </div>
        </div>
      </div>
      {showMenu && (
        <div className='token-selector-menu'>
          {isSearchable && (
            <div className='search-box'>
              <input autoFocus={true} onChange={onSearch} value={searchValue} />
            </div>
          )}
          {getOptions.map((token: any, index: number) => (
            <div
              onClick={() => onItemClick(token.ticker)}
              key={index}
              className={`token-selector-item ${
                isSelected(token.ticker) && 'selected'
              } d-flex align-items-center`}
            >
              <img
                src={
                  token.assets && token.assets['svgUrl']
                    ? token.assets['svgUrl']
                    : ''
                }
              />
              {`${token.name} (${token.ticker})`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
