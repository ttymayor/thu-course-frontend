"use client";

import Link from "next/link";
import { useVercount } from "vercount-react";

const FOOTER_CONFIG = {
  github_thu_course_frontend: "https://github.com/ttymayor/thu-course-frontend",
  github_thu_course_crawler: "https://github.com/ttymayor/thu-course-crawler",
  github: "https://github.com/ttymayor",
};

export default function Footer() {
  // const [touchTimes, setTouchTimes] = useState(0);
  const { sitePv, siteUv } = useVercount();

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full border-t backdrop-blur">
      <div className="mx-auto max-w-7xl p-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
          {/* 品牌資訊 */}
          <section className="footer-container">
            <h2 className="footer-heading text-lg">東海課程資訊</h2>
            <span className="footer-text">一個更好的東海課程資訊網站</span>
            <span className="footer-text">
              Developed by{" "}
              <Link
                href={FOOTER_CONFIG.github}
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
                prefetch={false}
              >
                tantuyu
              </Link>
            </span>
            <span className="footer-text">
              Contributor:{" "}
              <Link
                href="https://github.com/pan93412"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
                prefetch={false}
              >
                Pan
              </Link>
            </span>
          </section>

          {/* 相關連結 */}
          <section className="footer-container">
            <h4 className="footer-heading">相關連結</h4>

            <ol className="footer-list">
              <li>
                <Link
                  href="https://course.thu.edu.tw/"
                  prefetch={false}
                  className="footer-link"
                >
                  課程資訊網
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.thu.edu.tw/"
                  prefetch={false}
                  className="footer-link"
                >
                  東海學校首頁
                </Link>
              </li>
              <li>
                <Link
                  href="https://fsis.thu.edu.tw/"
                  prefetch={false}
                  className="footer-link"
                >
                  學生資訊系統
                </Link>
              </li>
              <li>
                <Link
                  href="https://ilearn.thu.edu.tw/"
                  prefetch={false}
                  className="footer-link"
                >
                  東海 iLearn
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.thu.edu.tw/web/calendar/page.php?scid=23&sid=36"
                  prefetch={false}
                  className="footer-link"
                >
                  東海行事曆
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.thu.edu.tw/web/pages/page.php?scid=66&sid=147"
                  prefetch={false}
                  className="footer-link"
                >
                  新生入學網
                </Link>
              </li>
            </ol>
          </section>

          {/* 連結區域 */}
          <section className="footer-container">
            <h4 className="footer-heading">專案連結</h4>

            <ol className="footer-list">
              <li>
                <Link
                  href={FOOTER_CONFIG.github_thu_course_frontend}
                  prefetch={false}
                  className="footer-link"
                >
                  前端專案
                </Link>
              </li>
              <li>
                <Link
                  href={FOOTER_CONFIG.github_thu_course_crawler}
                  prefetch={false}
                  className="footer-link"
                >
                  爬蟲專案
                </Link>
              </li>
              <li>
                <Link
                  href={FOOTER_CONFIG.github}
                  prefetch={false}
                  className="footer-link"
                >
                  GitHub
                </Link>
              </li>
            </ol>
          </section>

          <section className="footer-container">
            <div>
              <p className="footer-text">瀏覽人數 {siteUv}</p>
              <p className="footer-text">頁面瀏覽 {sitePv}</p>
            </div>
            <div className="footer-text">© 2025-2026 tantuyu</div>
          </section>
        </div>
      </div>
    </div>
  );
}
