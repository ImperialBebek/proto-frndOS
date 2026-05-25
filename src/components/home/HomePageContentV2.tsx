/** PROTOTYPE v2 home — Figma 2537:14184 */

import { Greeting } from "./Greeting";
import { CommandBar } from "./CommandBar";
import { SuggestionList } from "./SuggestionList";
import { BrandsSection } from "@/components/brands/BrandsSection";

export function HomePageContentV2() {
  return (
    <div className="flex flex-1 flex-col items-center gap-16 px-20 pb-28 pt-8">
      <div className="flex w-full max-w-[738px] flex-col items-center gap-12">
        <Greeting />
        <div className="flex w-full flex-col items-center gap-6">
          <CommandBar />
          <SuggestionList />
        </div>
      </div>
      <BrandsSection displayOnly />
    </div>
  );
}
