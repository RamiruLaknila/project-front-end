import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router doesn't reset scroll position on navigation -- clicking a
 * sidebar tab while scrolled down on the current page leaves the next page
 * rendered at that same scroll offset instead of at its top. Mounted once
 * inside the router, this resets the scroll on every route change.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
