"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const tags = [
  { id: 1, name: "iPhone", tag: "iphone" },
  { id: 2, name: "iPad", tag: "ipad" },
  { id: 3, name: "MacBook", tag: "macBook" },
  { id: 4, name: "Apple Watch", tag: "apple-watch" },
  { id: 5, name: "Android Phone", tag: "android-phone" },
  { id: 6, name: "Accessories", tag: "accessories" },
  { id: 7, name: "Cover", tag: "cover" },
];

const TagFilter = () => {
  const router = useRouter();
  const params = useSearchParams();
  const tagParams = params.get("tag") || "accessories";

  const handleTagClick = (tag: string) => {
    if (tag === tagParams) {
      router.push(`?tag=${tagParams}`);
    } else {
      router.push(`?tag=${tag}`);
    }
  };

  return (
    <div className="flex items-center justify-center gap-x-3 gap-y-1.5 flex-wrap max-w-2xl mx-auto ">
      {tags.map((t) => (
        <p
          className={cn(
            "cursor-pointer border-2 rounded-md px-2 py-1 border-primary text-sm",
            tagParams === t.tag && "bg-primary text-primary-foreground"
          )}
          onClick={() => handleTagClick(t.tag)}
          key={t.id}
        >
          {t.name}
        </p>
      ))}
    </div>
  );
};

export default TagFilter;
