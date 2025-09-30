"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const statusCodeMap: Record<number, string> = {
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a teapot",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
};

export default function NotFound() {
  const [statusCode, setStatusCode] = useState(404);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4 items-center justify-center">
        <h2
          className="text-4xl font-bold select-none cursor-pointer"
          onClick={() => setStatusCode(statusCode + 1)}
        >
          {statusCode} {statusCodeMap[statusCode] || "Unknown Error"}
        </h2>
        <p className="text-sm">找不到你要的頁面ㄟ</p>
        <Button variant="outline">
          <Link href="/" className="text-sm">
            返回首頁
          </Link>
        </Button>
      </div>
    </div>
  );
}
