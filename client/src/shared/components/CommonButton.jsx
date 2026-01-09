import { Link } from 'react-router';

const CommonButton = ({ children, navigate, secondary = false }) => {
  let className =
    'w-full text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 cursor-pointer';

  if (!secondary) {
    className += ' bg-discord-primary hover:bg-discord-primary-hover';
  } else {
    className += ' bg-discord-tertiary hover:bg-discord-tertiary-hover';
  }

  return navigate !== undefined ? (
    <Link to={navigate} className={className}>
      {children}
    </Link>
  ) : (
    <button className={className} type="submit">
      {children}
    </button>
  );
};

export default CommonButton;
