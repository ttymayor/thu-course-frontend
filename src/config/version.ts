export const APP_VERSION = "v1.5.2";

export interface VersionLog {
  version: string;
  date: string;
  changes: string[];
}

export const VERSION_LOGS: VersionLog[] = [
  {
    version: "v1.5.2",
    date: "2026-05-15",
    changes: [
      "新增排課模擬課程詳細資訊對話框",
      "版本日誌改為靜態資料，移除 git 子程序呼叫",
      "移除未使用的 DB 設定",
      "清理相依套件",
    ],
  },
  {
    version: "v1.5.1",
    date: "2026-02-25",
    changes: ["移除初始化時未使用的 storage key"],
  },
  {
    version: "v1.5.0",
    date: "2026-02-24",
    changes: [
      "以 WelcomeDialog 取代 FirstLoadingAnimation",
      "CourseSchedule 狀態改為 client-side 計算",
      "DetailView 全新 UI 設計",
      "CourseList 新增列表／卡片切換",
    ],
  },
  {
    version: "v1.4.0",
    date: "2026-01-16",
    changes: ["新增意見回饋字數驗證", "改善課程資訊元件", "更新相依套件"],
  },
  {
    version: "v1.3.0",
    date: "2026-01-08",
    changes: [
      "ScheduleCard 學分計算與 UI 優化",
      "ScheduleTable 以 useMemo 優化效能",
      "改善系所服務與 API 回應結構",
      "移除棄用課程 API 路由",
    ],
  },
  {
    version: "v1.2.0",
    date: "2025-11-24",
    changes: ["新增公告、課程時程、學校連結、FAQ 區塊", "整合 Accordion 元件"],
  },
  {
    version: "v1.1.0",
    date: "2025-10-22",
    changes: ["修正 tsconfig 路徑分隔符號"],
  },
  {
    version: "v1.0.1",
    date: "2025-10-15",
    changes: ["修正課程顯示錯誤"],
  },
  {
    version: "v1.0.0",
    date: "2025-10-13",
    changes: ["首次正式發佈"],
  },
];
