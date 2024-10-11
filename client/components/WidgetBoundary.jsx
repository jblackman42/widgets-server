import React, { useState } from 'react';
import { MdErrorOutline, MdOutlineWarningAmber  } from 'react-icons/md';

const WarningMsg = ({warning}) => {
  return warning && <div className="w-full max-w-screen-md mx-auto border p-1 border-warning bg-smoky-warning rounded-md flex gap-2">
    <MdOutlineWarningAmber className="text-2xl" />
    <p className="font-semibold">{warning}</p>
  </div>;
};
const ErrorMsg = ({error}) => {
  return error && <div className="w-full max-w-screen-md mx-auto border p-1 border-destructive bg-smoky-destructive rounded-md flex gap-2">
    <MdErrorOutline className="text-2xl" />
    <p className="font-semibold">{error}</p>
  </div>;
};

const WidgetBoundary = ({WidgetComponent, WidgetProps}) => {
 const [error, setError] = useState(null);
 const [warning, setWarning] = useState(null);

 if (warning) return <WarningMsg warning={warning} />;
 if (error) return <ErrorMsg error={error} />;

 return <WidgetComponent {...WidgetProps} handleError={setError} handleWarning={setWarning} />;
};

export default WidgetBoundary;