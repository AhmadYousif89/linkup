import { DynamicAnimationOptions, animate } from "framer-motion";
import { RefObject, useRef, useEffect } from "react";

type ScrollToBottom = <T extends HTMLElement>(
  containerRef: RefObject<T>,
  options?: DynamicAnimationOptions,
) => (delay?: number) => void;

const useScrollToBottom: ScrollToBottom = (containerRef, options = {}) => {
  const scrollTimeoutRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    if (!containerRef?.current) return;
    const scrollContainer = containerRef.current;
    animate(scrollContainer.scrollTop, scrollContainer.scrollHeight, {
      ...options,
      onUpdate: (value: number) => (scrollContainer.scrollTop = value),
    });
  };

  const scrollWithDelay = (delay: number = 10) => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(scrollToBottom, delay);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return scrollWithDelay;
};

export { useScrollToBottom };
