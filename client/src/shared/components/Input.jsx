import React from 'react';

const Input = React.forwardRef(
  ({ label, required = false, error, ...props }, ref) => {
    return (
      <div className="mt-5">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-text-header">
            {label} {required && <span className="text-danger ml-1">*</span>}
          </label>
        </div>

        <input
          ref={ref}
          className="w-full bg-input text-text-header p-3 rounded-lg outline-none border-2 border-input-border focus:border-primary font-medium h-11"
          {...props}
        />

        {error && (
          <span className="text-xs text-danger italic font-medium">
            {error.message}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
