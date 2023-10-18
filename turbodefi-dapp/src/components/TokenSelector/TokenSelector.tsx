import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import './TokenSelector.css';
import { useGetTokenInfo, useGetTokensBalanceInfo } from 'hooks';
import { formatAmount } from '@multiversx/sdk-dapp/utils/operations/formatAmount';

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
  isSearchable = true,
  defaultValue = '',
  filter = [],
  className = ''
}: {
  onChange: any;
  placeHolder?: string;
  isSearchable?: boolean;
  defaultValue?: string;
  filter?: string[];
  className?: string;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const tokenInfo = useGetTokenInfo();
  const balanceInfo = useGetTokensBalanceInfo();

  const wrapperRef = useRef(null);

  const handleInputClick = (e: any) => {
    if (filter.length != 1) setShowMenu(!showMenu);
  };

  const getDisplay = useCallback(() => {
    if (!selectedValue) {
      return placeHolder;
    }
    const token = tokenInfo.get(selectedValue);
    return (
      <>
        {token && token.assets && token.assets['svgUrl'] && (
          <img className='me-1' src={token.assets['svgUrl']} />
        )}{' '}
        {selectedValue}
      </>
    );
  }, [selectedValue, searchValue]);

  const onItemClick = (option: any) => {
    let newValue = option;
    setSelectedValue(newValue);
    onChange(newValue);
    handleInputClick(option);
  };

  const onSearch = (e: any) => {
    setSearchValue(e.target.value);
  };

  const getOptions = useMemo(() => {
    const tokenList = tokenInfo.getList(filter);

    return tokenList.filter(
      (token: any) =>
        searchValue == '' ||
        token.name
          .concat(' ', token.identifier)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
    );
  }, [tokenInfo.getList, searchValue, filter]);

  useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(event: any) {
      if (
        showMenu &&
        ![
          'token-selector-item',
          'token-selector-input',
          'token-selector-selected-value',
          'no-selectable'
        ].some((v) => event.target.className.includes(v))
      ) {
        handleInputClick(event);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, showMenu]);

  useEffect(() => {
    setSelectedValue(
      filter.includes(defaultValue) ? defaultValue : filter[0] ?? ''
    );
  }, [defaultValue]);

  return (
    <>
      <div className={`token-selector-container ${className}`} ref={wrapperRef}>
        <div onClick={handleInputClick} className='token-selector-input'>
          <div className='token-selector-selected-value d-flex align-items-center w-full'>
            {getDisplay()}
          </div>
          {filter.length != 1 && (
            <div className='token-selector-tool'>
              <Icon />
            </div>
          )}
        </div>

        <div
          className={`token-selector-floating-layer ${
            !showMenu ? 'd-none' : ''
          }`}
        >
          {isSearchable && showMenu && filter.length != 1 && (
            <div className='search-box'>
              <input
                className='token-selector-input'
                autoFocus={true}
                onChange={onSearch}
                value={searchValue}
              />
            </div>
          )}

          <div className='token-selector-menu'>
            {getOptions.map((token: any, index: number) => (
              <div
                onClick={() => onItemClick(token.identifier)}
                key={index}
                className={`token-selector-item ${
                  selectedValue === token.identifier && 'selected'
                } d-flex align-items-center`}
              >
                {token.assets && token.assets['svgUrl'] && (
                  <img
                    className='pe-1 no-selectable'
                    src={token.assets['svgUrl']}
                  />
                )}
                <span className='no-selectable'>{`${token.name}`}</span>
                <span
                  className={`ps-1 text-sm ${
                    selectedValue === token.identifier
                      ? ''
                      : 'text-gray-500 no-selectable'
                  }`}
                >{`(${token.identifier})`}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='text-gray-500 text-sm'>
          {'Balance: '}
          {tokenInfo.hasToken(selectedValue) &&
            formatAmount({
              input: balanceInfo.getBalance(selectedValue).toFixed(),
              decimals: tokenInfo.get(selectedValue, 'decimals'),
              digits: 5,
              addCommas: true,
              showLastNonZeroDecimal: false
            })}
        </div>
      </div>
    </>
  );
};
