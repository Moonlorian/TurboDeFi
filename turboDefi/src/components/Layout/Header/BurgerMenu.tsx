import { MxLink } from 'components/MxLink';
import { logout } from 'helpers';
import { useGetAccountInfo, useGetIsLoggedIn } from 'hooks';
import { RouteNamesEnum } from 'localConstants';
import { routes } from 'routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import { FormatedAddress } from 'components/FormattedAddress';
import { OptionsMenu } from './OptionsMenu';
import { useCallback, useState } from 'react';
import DappLogo from '../../../assets/img/dapp-logo.png';
import { Logo } from './Logo';

export const BurgerMenu = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const [hideMenu, setHideMenu] = useState(true);

  const toggleMenu = useCallback(() => setHideMenu(!hideMenu), [hideMenu]);
  return (
    <>
      <div className='lg:hidden'>
        <button
          className='text-gray-500 w-10 h-10 relative focus:outline-none bg-white'
          onClick={toggleMenu}
        >
          <div className='block w-5 absolute left-1/2 top-1/2   transform  -translate-x-1/2 -translate-y-1/2'>
            <span
              aria-hidden='true'
              className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                hideMenu ? '-translate-y-1.5' : 'rotate-45'
              }`}
            />
            <span
              aria-hidden='true'
              className={`block absolute  h-0.5 w-5 bg-current   transform transition duration-500 ease-in-out ${
                hideMenu ? '' : 'opacity-0'
              }`}
            />
            <span
              aria-hidden='true'
              className={`block absolute  h-0.5 w-5 bg-current transform  transition duration-500 ease-in-out ${
                hideMenu ? 'translate-y-1.5' : '-rotate-45'
              }`}
            />
          </div>
        </button>
      </div>
      <div className={`navbar-menu relative z-50 ${hideMenu ? 'hidden' : ''}`}>
        <div
          className='navbar-backdrop fixed inset-0 bg-gray-800 opacity-25'
          onClick={toggleMenu}
        ></div>
        <nav className='fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto'>
          <div className='flex items-center mb-8 justify-between'>
            <Logo />
            <button className='navbar-close' onClick={toggleMenu}>
              <svg
                className='h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                ></path>
              </svg>
            </button>
          </div>
          <div className='flex flex-column' onClick={toggleMenu}>
            <OptionsMenu />
          </div>
        </nav>
      </div>
    </>
  );
};
