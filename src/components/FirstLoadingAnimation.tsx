"use client";

import { useEffect, useRef, useState } from "react";
import {
  createScope,
  Scope,
  createTimeline,
  stagger,
  text,
  utils,
  animate,
  createAnimatable,
} from "animejs";

function createAnimation(animationRef: React.RefObject<HTMLDivElement | null>) {
  if (!animationRef.current) return null;

  // 創建動畫區域
  const scope = createScope({ root: animationRef.current }).add(() => {
    // 創建方塊動畫
    const [$particles] = utils.$("#particles");
    for (let i = 0; i < 100; i++) {
      const $particle = document.createElement("div");
      $particle.className = `w-2 h-2 rounded-full bg-black dark:bg-white absolute`;
      $particles.appendChild($particle);
      animate($particle, {
        x: utils.random(-80, 80) + "rem",
        y: utils.random(-80, 80) + "rem",
        scale: [0, 0, 0.5, 1, 1, 0],
        loop: true,
        delay: utils.random(0, 1000),
      });
    }

    // 創建文字動畫
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

    // 使動畫隨游標位置稍微偏移
    const $demos = document.querySelector("#container");
    const $demo = $demos?.querySelector("#particles");

    let bounds = $demo?.getBoundingClientRect();
    const refreshBounds = () => (bounds = $demo?.getBoundingClientRect());

    const animatableSquare = createAnimatable("#particles", {
      x: 500,
      y: 500,
      ease: "out(3)",
    });

    const onMouseMove = (e: MouseEvent) => {
      const { width, height, left, top } = bounds || {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      };
      const hw = width / 2;
      const hh = height / 2;
      const x = utils.clamp(e.clientX - left - hw, -hw, hw);
      const y = utils.clamp(e.clientY - top - hh, -hh, hh);
      animatableSquare.x(x * 0.1);
      animatableSquare.y(y * 0.1);
    };

    window.addEventListener("mousemove", onMouseMove);
    $demos?.addEventListener("scroll", refreshBounds);
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
      className={`fixed inset-0 z-40 backdrop-blur-xs bg-white/50 dark:bg-black/50 transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        id="container"
        className="relative h-screen flex items-center justify-center"
      >
        <div
          id="particles"
          className="absolute inset-0 z-50 flex items-center justify-center"
        ></div>
        <p className="text-xl font-bold text-center z-10 relative">
          東海選課資訊
          <br />
          一個更好的東海課程資訊網站
        </p>
      </div>
    </div>
  );
}
