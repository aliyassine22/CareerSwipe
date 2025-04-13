import React from "react";
export default function Input(props) {
    const {
      label,
      id,
      type = 'text',
      value,
      onChange,
      placeholder,
      required = false,
      ...rest
    } = props;
  
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          {...rest}
        />
      </div>
    );
  }
  