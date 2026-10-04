import { Skeleton } from "../ui/skeleton";

export function EntryListSkeleton() {
  return (
    <ul className="flex flex-col" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="flex flex-col gap-2.5 border-b border-border py-5"
        >
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </li>
      ))}
    </ul>
  );
}
