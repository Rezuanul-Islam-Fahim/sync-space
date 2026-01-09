import React from 'react';

const CommonInput = React.forwardRef(
  ({ label, required = false, error, ...props }, ref) => {
    return (
      <div className="mt-5">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-white">
            {label}{' '}
            {required && <span className="text-discord-danger ml-1">*</span>}
          </label>
        </div>

        <input
          ref={ref}
          className="w-full bg-discord-input text-discord-text p-3 rounded-lg outline-none border-2 border-discord-input-border focus:border-discord-primary font-medium h-11"
          {...props}
        />

        {error && (
          <span className="text-xs text-discord-danger italic font-medium">
            {error.message}
          </span>
        )}
      </div>
    );
  }
);

export default CommonInput;
