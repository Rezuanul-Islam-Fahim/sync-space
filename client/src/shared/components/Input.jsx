import React from 'react';

import FieldError from './FieldError';

const Input = React.forwardRef(
  ({ label, required = false, error, id, ...props }, ref) => {
    const inputId = id || props.name;
    const errorId = inputId ? `${inputId}-error` : undefined;

    return (
      <div className="mt-5">
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-text-header"
          >
            {label}{' '}
            {required && (
              <span className="text-danger ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        </div>

        <input
          id={inputId}
          ref={ref}
          aria-invalid={error ? true : false}
          aria-describedby={error ? errorId : undefined}
          className="w-full bg-input text-text-header p-3 rounded-lg outline-none border-2 border-input-border focus:border-primary font-medium h-11"
          {...props}
        />

        {error && <FieldError errorId={errorId}>{error.message}</FieldError>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
