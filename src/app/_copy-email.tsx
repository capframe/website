"use client";

import { useRef, useState } from "react";

/**
 * Click-to-copy contact affordance. `mailto:` links fire the OS
 * "select an app to open this link" dialog — on machines without a
 * configured mail client (most of them) that's a dead end on our most
 * important buttons. Copying the address always works; we only fall back
 * to navigating the mailto when the clipboard API itself is unavailable
 * (insecure context / very old browser).
 */
export function CopyEmail({
  email,
  label,
  className,
  copiedClassName,
}: {
  email: string;
  label: React.ReactNode;
  className?: string;
  /** Optional class swap while showing the copied state. */
  copiedClassName?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      // No clipboard available — fall back to the mail client after all.
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={`Copy ${email}`}
      aria-live="polite"
      className={copied && copiedClassName ? copiedClassName : className}
    >
      {copied ? <>✓ {email} copied</> : label}
    </button>
  );
}
