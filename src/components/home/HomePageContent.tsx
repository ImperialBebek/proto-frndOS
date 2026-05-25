/** PROTOTYPE home content — Figma 2487:5908 */

import { TopNav } from "@/components/nav/TopNav";
import { Greeting } from "./Greeting";
import { CommandBar } from "./CommandBar";
import { SuggestionList } from "./SuggestionList";
import { BrandsSection } from "@/components/brands/BrandsSection";
import type { TabId } from "@/data/homeStatic";

type HomePageContentProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onBrandSelect: (brandId: string) => void;
};

export function HomePageContent({
  activeTab,
  onTabChange,
  onBrandSelect,
}: HomePageContentProps) {
  return (
    <>
      <TopNav activeTab={activeTab} onTabChange={onTabChange} />
      <div className="flex flex-1 flex-col items-center gap-16 px-20 pb-28 pt-8">
        <div className="flex w-full max-w-[738px] flex-col items-center gap-12">
          <Greeting />
          <div className="flex w-full flex-col items-center gap-6">
            <CommandBar />
            <SuggestionList />
          </div>
        </div>
        <BrandsSection onBrandSelect={onBrandSelect} />
      </div>
    </>
  );
}
