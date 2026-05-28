import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop(): null {
  const { pathname } = useLocation();

  useEffect(() => {
    // ReturnType handles both browser and NodeJS timeout types safely
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", 
      });
    }, 10);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}