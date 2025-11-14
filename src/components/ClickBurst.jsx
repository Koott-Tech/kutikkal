"use client";

import { useEffect } from "react";

export default function ClickBurst() {
  useEffect(() => {
    if (typeof window === "undefined" || !document) return;

    const spawnBurst = (x, y) => {
      const burstContainer = document.createElement("span");
      burstContainer.className = "click-burst";
      burstContainer.style.left = `${x}px`;
      burstContainer.style.top = `${y}px`;

      const totalIcons = Math.floor(Math.random() * 3) + 2; // 2-4 icons

      for (let i = 0; i < totalIcons; i += 1) {
        const icon = document.createElement("span");
        icon.className = "click-burst__icon";

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 48 + 40;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const delay = Math.random() * 200;

        icon.style.setProperty("--burst-dx", `${dx}px`);
        icon.style.setProperty("--burst-dy", `${dy}px`);
        icon.style.setProperty("--burst-delay", `${delay}ms`);
        icon.style.animationDelay = `var(--burst-delay)`;
        icon.style.setProperty("--burst-scale", (Math.random() * 0.4 + 0.8).toFixed(2));

        burstContainer.appendChild(icon);
      }

      document.body.appendChild(burstContainer);

      const removeBurst = () => {
        if (burstContainer.parentNode) {
          burstContainer.parentNode.removeChild(burstContainer);
        }
      };

      burstContainer.addEventListener("animationend", removeBurst, {
        once: true,
      });
    };

    const handleClick = (event) => {
      spawnBurst(event.clientX, event.clientY);
    };

    const handleTouchStart = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      spawnBurst(touch.clientX, touch.clientY);
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          .click-burst {
            position: fixed;
            pointer-events: none;
            width: 0;
            height: 0;
            z-index: 9999;
            transform: translate(-50%, -50%);
          }
          .click-burst__icon {
            position: absolute;
            width: 20px;
            height: 20px;
            background-image: url('/favicon.gif');
            background-size: cover;
            opacity: 0.9;
            transform: scale(var(--burst-scale, 1));
            animation: clickBurstDrift 1150ms ease-out forwards;
            animation-delay: var(--burst-delay, 0ms);
          }
          @keyframes clickBurstDrift {
            0% {
              opacity: 0.9;
              transform: scale(var(--burst-scale, 1)) translate(0, 0);
            }
            80% {
              opacity: 0.35;
            }
            100% {
              opacity: 0;
              transform: scale(var(--burst-scale, 1.15)) translate(var(--burst-dx, 0), var(--burst-dy, 0));
            }
          }
          @media (max-width: 640px) {
            .click-burst__icon {
              width: 16px;
              height: 16px;
            }
          }
        `,
      }}
    />
  );
}

