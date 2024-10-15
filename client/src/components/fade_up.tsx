import { motion, useInView } from "framer-motion";
import { PropsWithChildren, useState, useEffect, useRef } from "react";

type FadeUpProps = PropsWithChildren & {
  className?: string;
  delay?: number;
  duration?: number;
};

interface FadeUpComponent
  extends React.FC<FadeUpProps & { as?: keyof JSX.IntrinsicElements }> {
  [key: string]: React.FC<FadeUpProps> | any;
}

const FadeUp: FadeUpComponent = ({
  children,
  className,
  delay = 0,
  duration = 0.5,
  as: Component = "li",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView && !isVisible) {
      setIsVisible(true);
    }
  }, [isInView, isVisible]);

  const MotionComponent = motion[
    Component as keyof typeof motion
  ] as typeof motion.div;

  return (
    <MotionComponent
      ref={ref}
      initial={false}
      className={className}
      transition={{ duration, delay }}
      animate={isVisible ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, translateY: "25px" },
        visible: { opacity: 1, translateY: "0px" },
      }}
    >
      {children}
    </MotionComponent>
  );
};

["section", "article", "aside", "div", "span", "li"].forEach((tag: string) => {
  FadeUp[tag] = (props: FadeUpProps) => (
    <FadeUp {...props} as={tag as keyof JSX.IntrinsicElements} />
  );
});

export default FadeUp;
