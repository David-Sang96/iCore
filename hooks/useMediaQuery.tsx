import { useEffect, useState } from "react";

const useMediaQuery = (query: string) => {
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setIsMatch(mediaQuery.matches);

    const handleViewPortWidthChange = () => setIsMatch(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleViewPortWidthChange);

    return () =>
      mediaQuery.removeEventListener("change", handleViewPortWidthChange);
  }, [query]);

  return isMatch;
};

export default useMediaQuery;
