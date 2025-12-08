import { useState } from 'react'

// body {
//   background: #333;
// }
// .snow-container {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   pointer-events: none;
//   z-index: 1000;
//   overflow: hidden;
//   box-shadow: 0rem 0rem 4rem inset #00000050;
// }

// .snowflake {
//   position: absolute;
//   top: -10px;
//   background: rgba(255, 255, 255, 0.8);
//   border-radius: 50%;
//   animation: fall linear infinite;
//   box-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
// }

// @keyframes fall {
//   0% {
//     transform: translateY(0) translateX(0) rotate(0deg);
//   }
//   50% {
//     transform: translateY(50vh) translateX(15px) rotate(180deg);
//   }
//   100% {
//     transform: translateY(100vh) translateX(30px) rotate(360deg);
//   }
// }
const ArtSnow = () => {
  const [snowflakes] = useState(() => {
    // Generate 50 snowflakes with random properties
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: `${(Math.random() * 4 + 3) * 1.3}s`,
      animationDelay: `${Math.random() * 2}s`,
      opacity: Math.random() * 0.7 + 0.9,
      size: `${Math.random() * 3 + 2}px`
    }))
  })

  return (
    <div className="snow-container">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            opacity: flake.opacity,
            width: flake.size,
            height: flake.size
          }}
        />
      ))}
    </div>
  )
}

export default ArtSnow
