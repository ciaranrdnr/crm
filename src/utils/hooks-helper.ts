import { useEffect, useState } from "react";

enum BREAKPOINT {
  MOBILE = 768,
  DESKTOP_SM = 1280
}


export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window?.innerWidth <= BREAKPOINT.MOBILE);
  const [isDesktopSm, setIsDesktopSm] = useState<boolean>(
    window?.innerWidth <= BREAKPOINT.DESKTOP_SM && window?.innerWidth > BREAKPOINT.MOBILE
  );

  const handleResize = () => {
    const width = window?.innerWidth;
    setIsMobile(width <= BREAKPOINT.MOBILE);
    setIsDesktopSm(width < BREAKPOINT.DESKTOP_SM && width > BREAKPOINT.MOBILE);
  };

  useEffect(() => {
    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile, isDesktopSm };
};