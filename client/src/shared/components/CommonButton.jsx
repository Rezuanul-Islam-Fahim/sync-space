import { Link } from 'react-router';
import cn from '@/shared/utils/cn';

const CommonButton = ({
    children,
    navigate,
    secondary = false,
    className,
    disabled = false,
}) => {
    const baseClassNames =
        'w-full text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 cursor-pointer';
    const secondaryClassNames = !secondary
        ? 'bg-primary hover:bg-primary-hover'
        : 'bg-tertiary hover:bg-tertiary-hover';
    const combinedClassNames = cn(
        baseClassNames,
        secondaryClassNames,
        className
    );

    return navigate !== undefined ? (
        <Link to={navigate} className={combinedClassNames}>
            {children}
        </Link>
    ) : (
        <button
            className={combinedClassNames}
            type="submit"
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default CommonButton;
