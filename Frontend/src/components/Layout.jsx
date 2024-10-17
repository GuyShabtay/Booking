import React from 'react';
import ProgressBar from './progressBar';

const Layout = ({ children }) => {
  return (
    <div id='app'>
      <ProgressBar />
        {children}
    </div>
  );
};

export default Layout;
