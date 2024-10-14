import React, { useEffect, useState } from 'react';

const Test = ({ userData }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    setIsAuthenticated(userData && Object.keys(userData).length);
    console.log(userData);
  }, [userData])
  return <>
    <p>{isAuthenticated ? userData.user.displayName : "User not logged in."}</p>
  </>;
};

export const Component = Test;
export const HTMLElementName = 'test';