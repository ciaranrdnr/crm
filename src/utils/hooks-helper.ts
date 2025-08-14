import { useEffect, useState } from "react";

enum BREAKPOINT {
  MOBILE = 768,
  DESKTOP_SM = 1280
}

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDesktopSm, setIsDesktopSm] = useState<boolean>(false);

  const handleResize = () => {
    const width = window.innerWidth;
    setIsMobile(width <= BREAKPOINT.MOBILE);
    setIsDesktopSm(width < BREAKPOINT.DESKTOP_SM && width > BREAKPOINT.MOBILE);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile, isDesktopSm };
};
