import { AshSwap, Card } from 'components';

export const AshSwapPage = () => {
  return (
    <div className='flex flex-col gap-6 max-w-7xl w-full'>
      <div className='flex flex-col rounded-xl bg-white py-6 px-[4%] md:px-6 flex-2'>
        <Card
          className='flex-2 w-full position-relative'
          title='Swap'
          description='Swap your tokens'
          reference={''}
        >
          <div className='w-[100%] lg:w-[70%] m-auto'>
            <AshSwap />
          </div>
        </Card>
      </div>
    </div>
  );
};
