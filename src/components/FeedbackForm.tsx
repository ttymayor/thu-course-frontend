"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpFromLine, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export default function FeedbackForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "feature",
    subject: "",
    message: "",
    is_anonymous: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleAnonymousChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_anonymous: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("回饋已送出", {
        description: "感謝您的寶貴意見！我們會盡快處理。",
      });

      setFormData({
        type: "feature",
        subject: "",
        message: "",
        is_anonymous: false,
      });

      // Optional: redirect to home or profile after success
      // router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("發送失敗", {
        description: error instanceof Error ? error.message : "請稍後再試",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>意見回饋</CardTitle>
        <CardDescription>
          不管是發現
          Bug、想要新功能，還是單純想給點建議，都歡迎告訴窩！還是你也是開發者？！歡迎來開{" "}
          <Link
            href={"https://github.com/ttymayor/thu-course-frontend"}
            className="underline hover:no-underline"
          >
            GitHub Issue
          </Link>{" "}
          或是發 PR
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pb-4">
          <div className="space-y-2">
            <Label htmlFor="type">回饋類型</Label>
            <Select
              value={formData.type}
              onValueChange={handleTypeChange}
              required
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="選擇類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feature">
                  <Badge className="rounded-full bg-green-100">Feature</Badge>
                  功能建議
                </SelectItem>
                <SelectItem value="bug">
                  <Badge className="rounded-full bg-red-100">Bug</Badge>
                  回報問題
                </SelectItem>
                <SelectItem value="other">
                  <Badge className="rounded-full bg-gray-100">Other</Badge>其他
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">標題</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="請簡短描述您的回饋"
              value={formData.subject}
              onChange={handleChange}
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">詳細內容</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="請詳細說明您的想法或遇到的問題..."
              value={formData.message}
              onChange={handleChange}
              required
              className="min-h-[150px]"
              maxLength={300}
            />
            <p className="text-muted-foreground text-right text-xs">
              {formData.message.length}/300
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_anonymous"
              checked={formData.is_anonymous}
              onCheckedChange={handleAnonymousChange}
            />
            <Label
              htmlFor="is_anonymous"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              匿名送出
            </Label>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowUpFromLine />
            )}
            {loading ? "傳送中..." : "送出回饋"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
