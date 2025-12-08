import React from "react";

const FormInput = ({
  label,
  name,
  type = "text",
  className = "",
  required = false,
  error,
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <label
          className={`block text-xs font-bold uppercase ${
            error ? "text-[#F23F42]" : "text-[#B5BAC1]"
          }`}
        >
          {label}{" "}
          {required && !error && <span className="text-[#F23F42] ml-1">*</span>}
        </label>

        {error && (
          <span className="text-xs text-[#F23F42] italic font-medium">
            {error}
          </span>
        )}
      </div>

      <input
        type={type}
        name={name}
        required={required}
        className="w-full bg-[#1E1F22] text-[#DBDEE1] p-2.5 rounded-[3px] outline-none focus:ring-0 border-none font-medium h-10"
        {...props}
      />
    </div>
  );
};

export default FormInput;
