/** PROTOTYPE greeting — Figma 2492:6642 */

import { getGreeting } from "@/lib/greeting";

export function Greeting() {
  return (
    <h1 className="bg-gradient-to-b from-primary-700 via-primary-400 via-[75%] to-primary-50 bg-clip-text text-[32px] font-medium leading-[1.2] tracking-[-0.48px] text-transparent">
      {getGreeting()}, Sabrina
    </h1>
  );
}
