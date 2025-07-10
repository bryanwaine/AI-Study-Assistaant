import { useEffect } from "react";

const useStaggeredAnimation = ({
  selector,
  animationClass,
  threshold = 0.2,
  staggerDelay = 50,
}) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Apply optional staggered delay using inline style
          el.style.transitionDelay = `${index * staggerDelay}ms`;

          // Delay class addition for actual animation start
          setTimeout(() => {
            el.classList.add(animationClass);
          }, index * staggerDelay);

          observer.unobserve(el);
        }
      });
    }, { threshold });

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector, animationClass, threshold, staggerDelay]);
};

export default useStaggeredAnimation;
