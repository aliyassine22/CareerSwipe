import React from "react";
export default function SubmitButton(props) {
    const { text = "Submit", ...rest } = props;

    return (
      <button
        type="submit"
        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition duration-200"
        {...rest}
      >
        {text}
      </button>
    );
  }
//       >