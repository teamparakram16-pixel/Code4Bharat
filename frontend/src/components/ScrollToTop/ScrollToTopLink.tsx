import React from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';

interface ScrollToTopLinkProps extends LinkProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const ScrollToTopLink: React.FC<ScrollToTopLinkProps> = ({ 
  children, 
  onClick, 
  ...props 
}) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Call the original onClick if provided
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <RouterLink {...props} onClick={handleClick}>
      {children}
    </RouterLink>
  );
};

export default ScrollToTopLink;
