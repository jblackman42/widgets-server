import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus } from "react-icons/fa6";

const Counter = ({initialvalue, handleError, handleWarning}) => {
  const [count, setCount] = useState(parseInt(initialvalue) || 0);
  const [prevCount, setPrevCount] = useState(count);

  const updateCount = (val) => {
    setPrevCount(count);
    setCount(x => x + val);
  }

  // Add this useEffect hook to simulate an error
  useEffect(() => {
    if (!initialvalue) {
      handleWarning("No initial value provided");
    };
    if (count === 5) {
      handleError("Test error: Count reached 5!");
    }
  }, [count]);

  return (
    <div className="w-full min-h-dvh grid place-items-center">
    <div className="flex items-center gap-2 p-2 rounded-full bg-slate-800 text-white">
      <button className="aspect-square p-4 rounded-full border-2 border-sky-600 hover:bg-sky-600 transition-colors" onClick={() => updateCount(-1)}><FaMinus/></button>
      <div className="grid place-items-center w-48 h-full relative" key={count}>
        <input className={`absolute bg-transparent text-4xl max-w-full text-center animate-fade-slide-in ${count > prevCount ? 'animate-slide-in-top' : count < prevCount ? 'animate-slide-in-bottom' : ''}`} type="text" readOnly disabled value={count} />
        <input className={`absolute bg-transparent text-4xl max-w-full text-center animate-fade-slide-out ${count > prevCount ? 'animate-slide-out-bottom' : count < prevCount ? 'animate-slide-out-top' : ''}`} type="text" readOnly disabled value={prevCount} />
      </div>
      <button className="aspect-square p-4 rounded-full border-2 border-sky-600 hover:bg-sky-600 transition-colors" onClick={() => updateCount(+1)}><FaPlus/></button>
    </div>
    </div>
  );
};

export const Component = Counter;
export const HTMLElementName = 'counter';