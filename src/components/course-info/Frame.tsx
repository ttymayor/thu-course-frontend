import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FrameProps {
  children: ReactNode;
}

export default function Frame({ children }: FrameProps) {
  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>選課資訊</CardTitle>
        <CardDescription>來看看選課資訊吧</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
