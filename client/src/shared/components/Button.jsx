import { BiLoaderAlt } from 'react-icons/bi';

import { classNames } from '@/shared/utils';

const Button = ({
  children,
  secondary = false,
  className,
  isLoading = false,
  onClick,
  type = 'button',
}) => {
  const baseClassNames =
    'w-full text-text-header font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed';
  const secondaryClassNames = !secondary
    ? 'bg-primary hover:bg-primary-hover'
    : 'bg-tertiary hover:bg-tertiary-hover';
  const combinedClassNames = classNames(
    baseClassNames,
    secondaryClassNames,
    className
  );

  return (
    <button
      onClick={onClick}
      className={combinedClassNames}
      type={type}
      disabled={isLoading}
    >
      {!isLoading ? (
        children
      ) : (
        <div className="flex justify-center items-center">
          <BiLoaderAlt className="animate-spin text-white text-2xl" />
        </div>
      )}
    </button>
  );
};

export default Button;
