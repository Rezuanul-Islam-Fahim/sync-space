const FieldError = ({ children, errorId }) => {
  return (
    <span
      id={errorId}
      role="alert"
      className="text-xs text-danger italic font-medium"
    >
      {children}
    </span>
  );
};

export default FieldError;
