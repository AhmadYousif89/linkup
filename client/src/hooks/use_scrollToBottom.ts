import { AnimationGeneratorType, Easing, animate } from "framer-motion";
import { RefObject, useRef, useEffect } from "react";

type ScrollContainerElement = HTMLElement;

interface ScrollOptions {
  type?: AnimationGeneratorType;
  duration?: number;
  delay?: number;
  ease?: Easing;
}

export const useScrollToBottom = <T extends ScrollContainerElement>(
  containerRef: RefObject<T>,
  options: ScrollOptions = {},
) => {
  const scrollTimeoutRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    // Add check for messages length here if needed
    if (!containerRef?.current) return;

    const scrollContainer = containerRef.current;

    animate(scrollContainer.scrollTop, scrollContainer.scrollHeight, {
      ...options,
      onUpdate: (value: number) => {
        if (scrollContainer) scrollContainer.scrollTop = value;
      },
    });
  };

  const scrollWithDelay = (delay: number = 10) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(scrollToBottom, delay);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollToBottom,
    scrollWithDelay,
  };
};
