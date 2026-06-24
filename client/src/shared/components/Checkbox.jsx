import React from 'react';
import cn from '../utils/classNames';

const Checkbox = React.forwardRef(
  ({ children, error, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    const errorId = inputId ? `${inputId}-error` : undefined;

    return (
      <div className={cn('flex flex-col', className)}>
        <div className="flex items-center gap-3 mb-1">
          <div className="relative flex items-center">
            <input
              ref={ref}
              type="checkbox"
              id={inputId}
              {...props}
              aria-invalid={error ? true : false}
              aria-describedby={error ? errorId : undefined}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-checkbox-border bg-content-bg checked:border-primary checked:bg-primary focus:outline-none transition-all"
            />
            <svg
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-text-header transition-opacity"
              viewBox="0 0 14 10"
              fill="none"
            >
              <path
                d="M1 5L4.5 8.5L13 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <label
            htmlFor={inputId}
            className="text-xs text-text-muted leading-4 cursor-pointer select-none"
          >
            {children}
          </label>
        </div>
        {error && (
          <span
            id={errorId}
            role="alert"
            className="text-xs text-danger italic font-medium"
          >
            {error.message}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
