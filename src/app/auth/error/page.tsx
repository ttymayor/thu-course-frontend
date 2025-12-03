import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ErrorType = "Configuration" | "AccessDenied" | "Verification" | "Default";

interface ErrorPageProps {
  searchParams: {
    error?: string;
  };
}

const errorMessages: Record<
  ErrorType,
  { title: string; description: React.ReactNode }
> = {
  Configuration: {
    title: "設定錯誤",
    description: <div>伺服器設定有誤，請聯繫管理員</div>,
  },
  AccessDenied: {
    title: "存取被拒絕",
    description: (
      <>
        此帳號未獲授權，請使用東海大學（
        <code className="font-bold text-blue-500 underline">
          @thu.edu.tw
        </code>{" "}
        或{" "}
        <code className="font-bold text-blue-500 underline">
          @go.thu.edu.tw
        </code>
        ）的 Google 帳號登入
      </>
    ),
  },
  Verification: {
    title: "驗證失敗",
    description: <div>驗證過程發生錯誤，請稍後再試</div>,
  },
  Default: {
    title: "發生錯誤",
    description: <div>登入過程中發生錯誤，請稍後再試</div>,
  },
};

export default function ErrorPage({ searchParams }: ErrorPageProps) {
  const error = (searchParams.error as ErrorType) || "Default";
  const errorInfo = errorMessages[error] || errorMessages.Default;

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">{errorInfo.title}</CardTitle>
          <CardDescription>{errorInfo.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/signin">返回登入頁面</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">返回首頁</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
