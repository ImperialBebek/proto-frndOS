/** PROTOTYPE shell — Figma 2487:5908 */

import type { ReactNode } from "react";

type AppShellProps = {
  topNav?: ReactNode | null;
  children: ReactNode;
  bottomNav?: ReactNode | null;
};

export function AppShell({ topNav, children, bottomNav }: AppShellProps) {
  return (
    <div className="isolate flex min-h-screen min-w-[1440px] flex-col rounded-[32px] bg-grey-50">
      {topNav}
      <main className="relative z-[2] flex flex-1 flex-col">{children}</main>
      {bottomNav}
    </div>
  );
}
