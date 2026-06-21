import { Link } from 'react-router';
import { classNames } from '@/shared/utils';

const LinkButton = ({ children, navigate, secondary = false, className }) => {
  const baseClassNames =
    'w-full text-text-header font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 cursor-pointer';
  const secondaryClassNames = !secondary
    ? 'bg-primary hover:bg-primary-hover'
    : 'bg-tertiary hover:bg-tertiary-hover';
  const combinedClassNames = classNames(
    baseClassNames,
    secondaryClassNames,
    className
  );

  return (
    <Link to={navigate} className={combinedClassNames}>
      {children}
    </Link>
  );
};

export default LinkButton;
