import { logout } from 'helpers';
import { useGetIsLoggedIn } from 'hooks';
import { OptionsMenu } from './OptionsMenu';
import { BurgerMenu } from './BurgerMenu';
import { Logo } from './Logo';

export const Header = () => {
  const isLoggedIn = useGetIsLoggedIn();

  const handleLogout = () => {
    sessionStorage.clear();
    logout(`${window.location.origin}/unlock`, undefined, false);
  };

  return (
    <header className='flex flex-row align-center justify-center pt-6 pb-0 px-[2%] md:px-6 items-center'>
      <div className='max-w-7xl w-full d-flex justify-between items-center border bg-bg-color rounded-xl py-1'>
        <div className='flex items-baseline'>
          <Logo />
        </div>
        <nav className='hidden lg:flex h-full w-full text-sm justify-end'>
          <div className='flex no-wrap items-center mr-3'>
            <OptionsMenu />
          </div>
        </nav>
        <BurgerMenu />
      </div>
    </header>
  );
};
