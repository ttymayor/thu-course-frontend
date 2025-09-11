import { render, screen, act } from "@testing-library/react";
import { expect, test, describe } from "vitest";
import Page from "@/app/page";

// 測試測試怎麼測試
describe("Home Page", () => {
  test("renders warning message", async () => {
    await act(async () => {
      render(<Page />);
    });

    expect(
      screen.getByText("所有資訊皆以東海大學課程資訊網為準。")
    ).toBeDefined();
  });

  test("renders course schedule section", async () => {
    await act(async () => {
      render(<Page />);
    });

    // 使用 getAllByTestId 來處理可能的重複元素
    const scheduleElements = screen.getAllByTestId("course-schedule-list");
    expect(scheduleElements.length).toBeGreaterThan(0);
  });

  test("renders school links section", async () => {
    await act(async () => {
      render(<Page />);
    });

    // 使用 getAllByText 來處理重複元素
    const courseInfoElements = screen.getAllByText("課程資訊網");
    expect(courseInfoElements.length).toBeGreaterThan(0);

    const schoolElements = screen.getAllByText("學校首頁");
    expect(schoolElements.length).toBeGreaterThan(0);
  });
});
