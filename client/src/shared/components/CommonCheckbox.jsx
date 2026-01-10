import cn from '../utils/cn';

const CommonCheckbox = ({ children, error, className, ...props }, ref) => {
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center gap-3 mb-1">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={props.name}
            {...props}
            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-discord-checkbox-border bg-discord-content-bg checked:border-discord-primary checked:bg-discord-primary focus:outline-none transition-all"
          />
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity"
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
          htmlFor={props.name}
          className="text-xs text-discord-text-muted leading-4 cursor-pointer select-none"
        >
          {children}
        </label>
      </div>
      {error && (
        <span className="text-xs text-discord-danger italic font-medium">
          {error.message}
        </span>
      )}
    </div>
  );
};

export default CommonCheckbox;
