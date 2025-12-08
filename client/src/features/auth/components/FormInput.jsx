import React from 'react';

const FormInput = ({ label, name, type = "text", className = "", required = false, ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-xs font-bold text-[#B5BAC1] uppercase mb-2">
        {label} {required && <span className="text-[#F23F42] ml-1">*</span>}
      </label>
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