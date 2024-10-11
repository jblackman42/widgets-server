import React, { useState, useEffect, useRef } from 'react';
import { defaultProfileImgURL } from '../lib/utils';

const useFitText = (initialFontSize = 32) => {
  const [fontSize, setFontSize] = useState(initialFontSize);
  const elementRef = useRef(null);

  useEffect(() => {
    const resizeText = () => {
      const element = elementRef.current;
      if (!element) return;
      const parentWidth = element.parentNode.offsetWidth;
      let newFontSize = initialFontSize;

      // Decrease font size until the element fits within its parent
      while (element.offsetWidth > parentWidth && newFontSize > 10) {
        newFontSize -= 1;
        element.style.fontSize = `${newFontSize}px`;
      }

      setFontSize(newFontSize);
    };

    // Run resizeText on mount and on window resize
    resizeText();
    window.addEventListener('resize', resizeText);

    return () => {
      window.removeEventListener('resize', resizeText);
    };
  }, [initialFontSize]);

  return { fontSize, elementRef };
};

const TeamMember = ({ staff, onEmailClick }) => {
  const { Last_Name, Nickname, Job_Title, Profile_Picture_URL } = staff;
  const displayName = `${Nickname} ${Last_Name}`;

  // Use the useFitText hook to adjust font size
  const { elementRef } = useFitText();

  return (
    <div className="w-52 flex flex-col justify-start">
      <div className="w-52 h-52 aspect-square rounded-full overflow-hidden border-[12px] border-accent outline outline-2 -outline-offset-[12px] outline-white">
        {/* <img className="" src={Profile_Picture_URL || defaultProfileImgURL} alt={displayName} /> */}
        <img className="" src={Profile_Picture_URL || defaultProfileImgURL} alt={displayName} />
      </div>
      <div className="relative">
        <h1
          ref={elementRef} // Attach the ref to the h1 element
          className="absolute -translate-y-[150%] -translate-x-1/2 left-1/2 w-max uppercase text-2xl mx-auto px-2 py-[2px] bg-white rounded-lg shadow-md"
        >
          {displayName}
        </h1>
      </div>
      <div className="my-auto">
        <p className="text-center">{Job_Title}</p>
      </div>
      {onEmailClick && <button onClick={() => onEmailClick(staff)} className="bg-accent text-white text-lg p-1 mt-auto rounded-md">
        Email {Nickname}
      </button>}
    </div>
  );
};

export default TeamMember;