import React from "react";

const FormCheckbox = ({ name, checked, onChange, children }) => {
  return (
    <div className="flex items-start gap-3 mb-2">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          name={name}
          id={name}
          checked={checked}
          onChange={onChange}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-[#4E5058] bg-[#1E1F22] checked:border-[#5865F2] checked:bg-[#5865F2] focus:outline-none transition-all"
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
        htmlFor={name}
        className="text-xs text-[#949BA4] leading-4 cursor-pointer select-none"
      >
        {children}
      </label>
    </div>
  );
};

export default FormCheckbox;
