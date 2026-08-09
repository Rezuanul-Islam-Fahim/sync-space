const ErrorBox = ({ children }) => {
  return (
    <div className="border border-danger/40 bg-danger/15 text-text-header px-4 py-2 rounded-md mb-5">
      {children}
    </div>
  );
};

export default ErrorBox;
