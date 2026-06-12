/** PROTOTYPE greeting — Figma 2492:6642 */

import { getGreeting } from "@/lib/greeting";

export function Greeting() {
  return (
    <h1 className="bg-gradient-to-b from-primary-400 via-primary-500 via-[75%] to-primary-950 bg-clip-text text-[32px] font-medium leading-[1.2] tracking-[-0.48px] text-transparent">
      {getGreeting()}, Sabrina
    </h1>
  );
}
