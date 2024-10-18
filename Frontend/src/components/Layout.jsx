import React from 'react';
import ProgressBar from './ProgressBar';

const Layout = ({ children }) => {
  return (
    <div id='app'>
      <ProgressBar />
        {children}
    </div>
  );
};

export default Layout;
