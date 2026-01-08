const AuthButton = ({ children, onClick, type = 'submit' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-2.5 rounded-[3px] transition-colors duration-200 mt-4 mb-2"
    >
      {children}
    </button>
  );
};

export default AuthButton;
