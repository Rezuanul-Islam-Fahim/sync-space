import React from 'react';

const CommonInput = React.forwardRef(
  ({ label, required = false, error, ...props }, ref) => {
    return (
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-white">
            {label} {required && <span className="text-[#F23F42] ml-1">*</span>}
          </label>
        </div>

        <input
          ref={ref}
          className="w-full bg-[#34353c] text-[#DBDEE1] p-3 rounded-lg outline-none focus:ring-1 focus:ring-[#5865f3] border-1 border-[#3d3d45] font-medium h-11"
          {...props}
        />

        {error && (
          <span className="text-xs text-[#F23F42] italic font-medium">
            {error.message}
          </span>
        )}
      </div>
    );
  }
);

export default CommonInput;
