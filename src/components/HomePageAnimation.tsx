"use client";

import { useEffect, useRef, useState } from "react";
import { createScope, Scope, createTimeline, stagger, text } from "animejs";

export default function HomePageAnimation() {
  const animation = useRef<HTMLDivElement | null>(null);
  const scope = useRef<Scope | null>(null);
  const [shouldRender, setShouldRender] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setShouldRender(false);
      }, 500);
    }, 3000);

    scope.current = createScope({ root: animation }).add(() => {
      const { words, chars } = text.split("p", {
        words: { wrap: "clip" },
        chars: true,
      });
      createTimeline({
        defaults: { ease: "inOut(3)", duration: 1000 },
      })
        .add(
          words,
          {
            y: [($el) => (+$el.dataset.line % 2 ? "100%" : "-100%"), "0%"],
          },
          stagger(125)
        )
        .add(
          chars,
          {
            y: [($el) => (+$el.dataset.line % 2 ? "100%" : "-100%")],
          },
          stagger(10, { from: "random" })
        )
        .init();
    });

    return () => {
      clearTimeout(timer);
      scope.current?.revert();
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      ref={animation}
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="large centered grid square-grid h-screen items-center justify-center">
        <p className="text-xl text-center">
          東海選課資訊
          <br />
          一個更好的東海課程資訊網站
        </p>
      </div>
    </div>
  );
}
