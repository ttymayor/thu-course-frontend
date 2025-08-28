"use client";

import { useEffect, useRef, useState } from "react";
import {
  createScope,
  Scope,
  createTimeline,
  stagger,
  text,
  // utils,
  // waapi,
} from "animejs";

// 抽出動畫邏輯成獨立函數
function createAnimation(animationRef: React.RefObject<HTMLDivElement | null>) {
  if (!animationRef.current) return null;

  // 創建動畫區域
  const scope = createScope({ root: animationRef.current }).add(() => {
    const { words, chars } = text.split("p", {
      words: { wrap: "clip" },
      chars: true,
    });

    // 創建方塊動畫
    // const [$particles] = utils.$("#particles");
    // const particles = [];
    // for (let i = 0; i < 10; i++) {
    //   const $particle = document.createElement("div");
    //   $particle.className = `square-${i} w-10 h-10 rounded bg-black dark:bg-white absolute`;
    //   $particles.appendChild($particle);
    //   particles.push(
    //     waapi.animate($particle, {
    //       x: utils.random(-10, 10) + "rem",
    //       y: utils.random(-10, 10) + "rem",
    //       scale: [0, 1, 0],
    //       delay: utils.random(0, 1000),
    //       loop: true,
    //     })
    //   );
    // }

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
    // .sync(...particles);
  });

  return scope;
}

export default function FirstLoadingAnimation() {
  const animation = useRef<HTMLDivElement | null>(null);
  const scope = useRef<Scope | null>(null);
  const [render, setRender] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
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
      scope.current = createAnimation(animation);
    });

    return () => {
      clearTimeout(timer);
      clearTimeout(animationTimer);
      scope.current?.revert();
    };
  }, []);

  if (!render) return null;

  return (
    <div
      ref={animation}
      className={`fixed inset-0 z-40 bg-white dark:bg-black transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="large centered grid square-grid h-screen items-center justify-center">
        <div
          id="particles"
          className="absolute top-0 left-0 w-full h-full z-50 items-center justify-center"
        ></div>
        <p className="text-xl font-bold text-center">
          東海選課資訊
          <br />
          一個更好的東海課程資訊網站
        </p>
      </div>
    </div>
  );
}
