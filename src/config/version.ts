export const APP_VERSION = "v2.0.0";

export interface VersionLog {
  version: string;
  date: string;
  changes: string[];
}

export const VERSION_LOGS: VersionLog[] = [
  {
    version: "v2.0.0",
    date: "2026-05-19",
    changes: [
      "全新導覽列與底部導覽列設計，內嵌主題切換",
      "排課模擬器改為首頁，移除獨立課程資訊頁",
      "雲端同步課表與書籤（需登入）",
      "登入限制為 @go.thu.edu.tw 帳號",
      "依學號自動推薦系所篩選",
      "修正 ModeToggle hydration 不一致問題",
      "修正 rateLimit IP 擷取順序，以 x-real-ip 為優先",
      "修正書籤操作在 HTTP 錯誤時錯誤顯示成功訊息",
      "API 路由補齊 try/catch 錯誤處理",
      "初始載入以 DB 資料覆蓋 localStorage，確保離線可用",
    ],
  },
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
