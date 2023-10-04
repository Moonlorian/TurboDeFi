import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';

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
  isSearchable = true,
  defaultValue = ''
}: {
  onChange: any;
  placeHolder?: string;
  isSearchable?: boolean;
  defaultValue?: string;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const tokenInfo = useGetTokenInfo();

  const wrapperRef = useRef(null);

  const handleInputClick = (e: any) => {
    setShowMenu(!showMenu);
  };

  const getDisplay = () => {
    if (!selectedValue) {
      return placeHolder;
    }
    const token = tokenInfo.get(selectedValue);
    return (
      <>
        {token && token.assets && token.assets['svgUrl'] && (
          <img src={token.assets['svgUrl']} />
        )}{' '}
        {selectedValue}
      </>
    );
  };

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
    const tokenList = tokenInfo.getList();

    return tokenList.filter(
      (token: any) =>
        searchValue == '' ||
        token.name
          .concat(' ', token.identifier)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
    );
  }, [tokenInfo.getList, searchValue]);

  useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(event: any) {
      if (
        showMenu &&
        ![
          'token-selector-item',
          'token-selector-input',
          'token-selector-selected-value'
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
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className='token-selector-container' ref={wrapperRef}>
      <div onClick={handleInputClick} className='token-selector-input'>
        <div className='token-selector-selected-value d-flex align-items-center w-100'>
          {getDisplay()}
        </div>
        <div className='token-selector-tool'>
          <Icon />
        </div>
      </div>

      <div
        className={`token-selector-floating-layer ${!showMenu ? 'd-none' : ''}`}
      >
        {isSearchable && showMenu && (
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
                <img src={token.assets['svgUrl']} />
              )}
              {`${token.name} (${token.identifier})`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};