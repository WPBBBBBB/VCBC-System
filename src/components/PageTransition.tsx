import React, { useEffect } from 'react';
import './PageTransition.css';

interface PageTransitionProps {
  children: React.ReactNode;
  key?: string | number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, key }) => {
  useEffect(() => {
    // Trigger animation when component mounts
    const element = document.querySelector('.page-transition');
    if (element) {
      element.classList.remove('page-exit');
      element.classList.add('page-enter');
    }

    return () => {
      // Add exit animation when component unmounts
      const element = document.querySelector('.page-transition');
      if (element) {
        element.classList.remove('page-enter');
        element.classList.add('page-exit');
      }
    };
  }, [key]);

  return (
    <div className="page-transition page-enter" key={key}>
      {children}
    </div>
  );
};

export default PageTransition;
