/** Shared profile avatar — Figma Photo component */

"use client";

import { useState } from "react";
import { USER_AVATAR_URL } from "@/data/homeStatic";

type UserAvatarProps = {
  size?: number;
  className?: string;
};

export function UserAvatar({ size = 32, className = "" }: UserAvatarProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-rounded bg-grey-100 ring-1 ring-grey-100 ${className}`}
      style={{ width: size, height: size }}
    >
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={USER_AVATAR_URL}
          alt="Profile"
          width={size}
          height={size}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="flex size-full items-center justify-center bg-primary-50 text-xs font-medium text-primary-700"
          aria-hidden
        >
          S
        </div>
      )}
    </div>
  );
}
