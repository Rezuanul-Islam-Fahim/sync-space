import { Link } from 'react-router';

const CommonButton = ({ children, navigate, secondary = false }) => {
  let className =
    'w-full text-white font-medium py-2.5 px-6 rounded-md transition-colors duration-200 cursor-pointer';

  if (!secondary) {
    className += ' bg-[#5865F2] hover:bg-[#404BC2]';
  } else {
    className += ' bg-[#4f545c] hover:bg-[#686d73]';
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
