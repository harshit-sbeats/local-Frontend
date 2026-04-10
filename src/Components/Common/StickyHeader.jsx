import React, { useState, useEffect, useRef } from 'react';

const StickyHeader = ({ children }) => {
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the sentinel is NOT intersecting, it means it's scrolled off-top
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: [1.0] }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* This invisible div sits exactly where the scroll starts */}
      <div ref={sentinelRef} style={{ height: '0px', marginBottom: '-1px' }} />
      <div className={`page-sticky-header ${isStuck ? 'is-stuck' : ''}`}>
        {children}
      </div>
    </>
  );
};

export default StickyHeader;