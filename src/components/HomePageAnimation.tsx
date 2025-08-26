"use client";

import { useEffect, useRef, useState } from "react";
import { createScope, Scope, createTimeline, stagger, text } from "animejs";
import { usePathname } from "next/navigation";

export default function HomePageAnimation() {
  const animation = useRef<HTMLDivElement | null>(null);
  const scope = useRef<Scope | null>(null);
  const [render, setRender] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      setRender(false);
      return;
    }

    const isFirstLoad = localStorage.getItem("first-loading") === null;

    if (!isFirstLoad) {
      setRender(false);
      return;
    }

    localStorage.setItem("first-loading", "true");

    setRender(true);

    const timer = setTimeout(() => {
      setIsFading(true);
      // 淡出動畫完成後（500ms）刪除元素
      setTimeout(() => {
        setRender(false);
      }, 500);
    }, 3000);

    // 等待 DOM 元素渲染完成後再創建動畫
    const animationTimer = setTimeout(() => {
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
    });

    return () => {
      clearTimeout(timer);
      clearTimeout(animationTimer);
      scope.current?.revert();
    };
  }, [pathname]);

  if (!render) return null;

  return (
    <div
      ref={animation}
      className={`fixed inset-0 z-50 bg-white dark:bg-black transition-opacity duration-500 ${
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
