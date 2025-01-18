import { Loader2 } from "lucide-react";
import React from "react";

export default function loadingPage() {
  return (
    <div className="flex w-full h-screen fixed justify-center items-center">
      <Loader2 className="size-4 animate-spin" />
    </div>
  );
}
