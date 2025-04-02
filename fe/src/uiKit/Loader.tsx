import { Spinner } from './Spinner.tsx';

export const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <Spinner />
    </div>
  );
};
