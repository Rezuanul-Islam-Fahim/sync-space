import { Link } from 'react-router';

const CommonButton = ({ children, navigate, onClick, secondary = false }) => {
  let className =
    'w-full text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 cursor-pointer';

  if (!secondary) {
    className += ' bg-[#5865F2] hover:bg-[#4752c4]';
  } else {
    className += ' bg-[#4f545c] hover:bg-[#686d73]';
  }

  return navigate !== undefined && onClick === undefined ? (
    <Link to={navigate} className={className}>
      {children}
    </Link>
  ) : (
    <button onClick={onClick} className={className} type="submit">
      {children}
    </button>
  );
};

export default CommonButton;
