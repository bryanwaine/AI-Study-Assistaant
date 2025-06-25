// BubbleBackground.tsx
const BubbleBackground = () => {
  const bubbles = Array.from({ length: 40 });

  return (
    <div className="absolute h-screen inset-0 overflow-hidden z-0">
      {bubbles.map((_, i) => {
        const size = Math.floor(Math.random() * 12) + 4; // 4–16px
        const left = Math.random() * 100; // percent
        const delay = Math.random() * 10; // 0–10s
        const duration = 8 + Math.random() * 6; // 8–14s

        return (
          <div
            key={i}
            className="absolute bottom-[-2rem] rounded-full bg-white opacity-20 blur-md animate-float-up"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
};

export default BubbleBackground;