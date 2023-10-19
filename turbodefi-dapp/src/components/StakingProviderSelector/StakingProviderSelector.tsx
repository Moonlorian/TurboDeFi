import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';

import './StakingProviderSelector.css';

const Icon = () => {
  return (
    <svg height='20' width='20' viewBox='0 0 20 20'>
      <path d='M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z'></path>
    </svg>
  );
};

export const StakingProviderSelector = ({
  onChange,
  filter,
  placeHolder = '',
  isSearchable = true,
  defaultValue = '',

  className = ''
}: {
  onChange: any;
  filter: any[];
  placeHolder?: string;
  isSearchable?: boolean;
  defaultValue?: string;
  className?: string;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const wrapperRef = useRef(null);

  const handleInputClick = (e: any) => {
    if (filter.length != 1) setShowMenu(!showMenu);
  };

  const getDisplay = useCallback(() => {
    const provider = filter.find(
      (providerData) => providerData.contract == selectedValue
    );
    if (!provider) return placeHolder;
    return (
      <>
        {provider.identity && provider.identity.avatar && (
          <img className='me-1 rounded-circle' src={provider.identity.avatar} />
        )}{' '}
        {provider.identity.name}
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
    return filter.filter((providerData: any) => {
      return (
        providerData?.contract &&
        providerData?.identity &&
        providerData.identity?.name &&
        (searchValue == '' ||
          providerData.identity.name
            .toLowerCase()
            .includes(searchValue.toLowerCase()))
      );
    });
  }, [searchValue, filter]);

  useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(event: any) {
      if (
        showMenu &&
        ![
          'stakingProvider-selector-item',
          'stakingProvider-selector-input',
          'stakingProvider-selector-selected-value',
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
      filter.find((providerData) => providerData.contract == defaultValue)
        ?.contract ?? ''
    );
  }, [defaultValue]);

  return (
    <>
      <div
        className={`stakingProvider-selector-container ${className}`}
        ref={wrapperRef}
      >
        <div
          onClick={handleInputClick}
          className='stakingProvider-selector-input'
        >
          <div className='stakingProvider-selector-selected-value d-flex align-items-center w-full'>
            {getDisplay()}
          </div>
          {filter.length != 1 && (
            <div className='stakingProvider-selector-tool'>
              <Icon />
            </div>
          )}
        </div>

        <div
          className={`stakingProvider-selector-floating-layer ${
            !showMenu ? 'd-none' : ''
          }`}
        >
          {isSearchable && showMenu && filter.length != 1 && (
            <div className='search-box'>
              <input
                className='stakingProvider-selector-input'
                autoFocus={true}
                onChange={onSearch}
                value={searchValue}
              />
            </div>
          )}

          <div className='stakingProvider-selector-menu'>
            {getOptions.map((provider: any, index: number) => (
              <div
                onClick={() => onItemClick(provider.contract)}
                key={index}
                className={`stakingProvider-selector-item ${
                  selectedValue === provider.cotract && 'selected'
                } d-flex align-items-center`}
              >
                {provider.identity && provider.identity.avatar && (
                  <img
                    className='pe-1 no-selectable rounded-circle'
                    src={provider.identity.avatar}
                  />
                )}
                <span className='no-selectable'>{`${provider.identity.name}`}</span>
                {provider?.featured && (
                  <span
                    className={`pt-1 ps-1 text-sm text-blue-500 ${
                      selectedValue === provider.cotract ? '' : 'no-selectable'
                    }`}
                  >
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
