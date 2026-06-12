/** PROTOTYPE v3 placeholder content */

type PlaceholderPageProps = {
  title: string;
  description?: string;
};

export function PlaceholderPage({
  title,
  description = "This section is a placeholder in the prototype.",
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-32 text-center">
      <p className="text-2xl font-medium tracking-[-0.36px] text-text-inverse">
        {title}
      </p>
      <p className="max-w-[360px] text-sm text-text-inverse-subtle">
        {description}
      </p>
    </div>
  );
}
