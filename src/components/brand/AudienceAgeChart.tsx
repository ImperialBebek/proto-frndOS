/** PROTOTYPE chart placeholder — Figma Line chart 2492:8295 */

export function AudienceAgeChart() {
  return (
    <div className="flex h-full min-h-[260px] w-full flex-col">
      <p className="text-lg font-medium tracking-[-0.36px] text-text-subtlest">
        Audience Age
      </p>
      <div className="relative mt-4 flex flex-1 items-end">
        <svg
          viewBox="0 0 400 200"
          className="h-full w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4e9ef8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#4e9ef8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#419170" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#419170" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,120 L50,100 L100,130 L150,80 L200,90 L250,60 L300,70 L350,40 L400,50 L400,200 L0,200 Z"
            fill="url(#blueGrad)"
          />
          <path
            d="M0,140 L50,120 L100,110 L150,100 L200,95 L250,85 L300,75 L350,65 L400,55"
            fill="none"
            stroke="#4e9ef8"
            strokeWidth="2"
          />
          <path
            d="M0,150 L50,140 L100,125 L150,115 L200,105 L250,95 L300,88 L350,78 L400,70 L400,200 L0,200 Z"
            fill="url(#greenGrad)"
          />
          <path
            d="M0,160 L50,150 L100,135 L150,128 L200,118 L250,108 L300,98 L350,90 L400,82"
            fill="none"
            stroke="#419170"
            strokeWidth="2"
          />
          <path
            d="M0,170 L50,165 L100,155 L150,148 L200,140 L250,132 L300,125 L350,118 L400,110 L400,200 L0,200 Z"
            fill="url(#roseGrad)"
          />
          <path
            d="M0,175 L50,170 L100,162 L150,155 L200,148 L250,140 L300,133 L350,125 L400,118"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-xs text-text-subtlest">
        <span>Jan 22</span>
        <span>Jan 23</span>
        <span>Jan 24</span>
        <span>Jan 25</span>
        <span>Jan 26</span>
      </div>
    </div>
  );
}
