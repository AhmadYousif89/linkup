import { useEffect } from "react";

export function usePreventScroll(state: any) {
  useEffect(() => {
    if (state) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [state]);

  return state;
}
