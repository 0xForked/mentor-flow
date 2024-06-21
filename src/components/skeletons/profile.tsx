import { Skeleton } from "../ui/skeleton";

export const ProfileSkeleton = () => (
  <>
    <div className="flex flex-row gap-2 items-center rounded-xl bg-gray-100 p-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[60px]" />
        <Skeleton className="h-4 w-[110px]" />
      </div>
    </div>
    <div className="p-4 space-y-2">
      <div className="flex items-center gap-2 text-xs">
        <Skeleton className="h-4 w-[15px]" />
        <Skeleton className="h-4 w-[40px]" />
      </div>
      <div className="flex items-center gap-2 text-xs">
        <Skeleton className="h-4 w-[15px]" />
        <Skeleton className="h-4 w-[60px]" />
      </div>
      <div className="flex items-center gap-2 text-xs">
        <Skeleton className="h-4 w-[15px]" />
        <Skeleton className="h-4 w-[110px]" />
      </div>
      <div className="flex items-center gap-2 text-xs">
        <Skeleton className="h-4 w-[15px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  </>
);
