"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "first-welcome";
const subscribe = () => () => {};
const getServerSnapshot = () => false;

function getShouldShowWelcome() {
  return localStorage.getItem(STORAGE_KEY) === null;
}

/**
 * Remove on v1.7.0
 */
const STORAGE_KEY_REMOVE = "first-loading";
function removeFirstLoading() {
  if (localStorage.getItem(STORAGE_KEY_REMOVE) === null) {
    localStorage.removeItem(STORAGE_KEY_REMOVE);
  }
}

export default function WelcomeDialog() {
  const shouldShowWelcome = useSyncExternalStore(
    subscribe,
    getShouldShowWelcome,
    getServerSnapshot,
  );
  const [dismissed, setDismissed] = useState(false);
  const [doNotShow, setDoNotShow] = useState(false);

  useEffect(() => {
    removeFirstLoading();
  }, []);

  function handleClose() {
    if (doNotShow) {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    setDismissed(true);
  }

  return (
    <Dialog open={shouldShowWelcome && !dismissed}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>歡迎使用東海課程資訊</DialogTitle>
          <DialogDescription>使用前請閱讀以下說明</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <section>
            <h3 className="mb-1 font-semibold">隱私聲明</h3>
            <p className="text-muted-foreground">
              本網站使用 Google Analytics
              蒐集匿名訪客統計資料（如頁面瀏覽量、地區分佈），以改善使用者體驗，不會蒐集個人識別資訊。選課模擬器預設僅在本地端（瀏覽器）儲存您的選課記錄。
            </p>
            <p className="text-muted-foreground mt-2">
              若您選擇登入並使用「儲存課表」同步功能，您的課程選擇將會被記錄至我們的伺服器。登入功能僅供東海大學電子郵件（@go.thu.edu.tw）使用，登入狀態以
              Cookie 儲存於您的瀏覽器中。
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-semibold">瀏覽器相容性</h3>
            <p className="text-muted-foreground">
              建議使用最新版的 Chrome 瀏覽器以獲得最佳體驗。Firefox、Safari 或
              Edge 瀏覽器體驗若有出現問題，請登入後給與回饋回報問題。
            </p>
          </section>
        </div>

        <DialogFooter className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="do-not-show"
              checked={doNotShow}
              onCheckedChange={(checked) => setDoNotShow(checked === true)}
            />
            <Label htmlFor="do-not-show" className="cursor-pointer font-normal">
              不再顯示
            </Label>
          </div>
          <Button onClick={handleClose}>關閉</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
