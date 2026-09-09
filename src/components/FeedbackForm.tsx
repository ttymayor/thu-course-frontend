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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpFromLine, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

interface FeedbackFormData {
  type: string;
  subject: string;
  message: string;
  is_anonymous: boolean;
}

async function submitFeedback(formData: FeedbackFormData) {
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
}

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

  const handleTypeChange = (value: string | null) => {
    if (value) {
      setFormData((prev) => ({ ...prev, type: value }));
    }
  };

  const handleAnonymousChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_anonymous: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitFeedback(formData);

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
    }
    setLoading(false);
  };

  const feedbackTypeOptions = [
    {
      label: "功能點子",
      value: "feature",
      badgeLabel: "Feature",
      badgeClassName:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    },
    {
      label: "問題回報",
      value: "bug",
      badgeLabel: "Bug",
      badgeClassName:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    },
    {
      label: "其他",
      value: "other",
      badgeLabel: "Other",
      badgeClassName:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    },
  ];

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
        <CardContent className="flex flex-col gap-4 pb-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">回饋類型</Label>
            <Select
              value={formData.type}
              onValueChange={handleTypeChange}
              items={feedbackTypeOptions}
              required
            >
              <SelectTrigger id="type" className="w-1/2">
                <SelectValue placeholder="選擇類型">
                  {(value) => {
                    const option = feedbackTypeOptions.find(
                      (item) => item.value === value,
                    );

                    return option ? (
                      <>
                        <Badge
                          className={`rounded-full ${option.badgeClassName}`}
                        >
                          {option.badgeLabel}
                        </Badge>
                        {option.label}
                      </>
                    ) : (
                      "選擇類型"
                    );
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {feedbackTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <Badge
                        className={`rounded-full ${option.badgeClassName}`}
                      >
                        {option.badgeLabel}
                      </Badge>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
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
          <div className="flex items-center gap-2">
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
