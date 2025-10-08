"use client";

import { useEffect } from "react";
import { errornotify } from "@/lib/notifications";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    errornotify(error.message);
  }, [error]);

  return <></>;
}
