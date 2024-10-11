import React from 'react';

const Spinner = () => {
  return (
    <div className="w-full grid place-items-center p-4">
      <div className="w-20 h-20 border-8 border-slate-300 border-t-accent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;