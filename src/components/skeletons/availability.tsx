import { Skeleton } from "../ui/skeleton";

export const AvailabilitySkeleton = () => (
  <>
    <Skeleton className="h-8 w-[120px]" />
    <section className="space-y-2 mt-4">
      <span className="flex flex-row items-center text-sm font-normal">
        <Skeleton className="h-4 w-4 mr-2" />
        <Skeleton className="h-4 w-[160px]" />
      </span>
      <span className="flex flex-row items-center text-sm font-normal">
        <Skeleton className="h-4 w-4 mr-2" />
        <Skeleton className="h-4 w-[100px]" />
      </span>
    </section>
    <section className="flex flex-col my-6 gap-4">
      {[0, 1, 2, 3, 4, 5, 6].map((item) => (
        <div className="flex flex-row justify-between items-center" key={item}>
          <div className="flex flex-row gap-2 items-center">
            <Skeleton className="h-8 w-12 rounded-xl" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Skeleton className="h-10 w-24" />
            <span>-</span>
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      ))}
    </section>
    <section className="space-y-4">
      <section className="bg-gray-100 relative rounded-md divide-y divide-dashed">
        <div className="flex flex-row gap-4 p-4">
          <Skeleton className="h-10 w-10" />
          <div className="relative overflow-auto">
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-80 mt-2" />
          </div>
        </div>
        <div className="flex flex-row gap-4 p-4">
          <Skeleton className="h-10 w-10" />
          <div className="relative overflow-auto">
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-80 mt-2" />
          </div>
        </div>
      </section>
      <section className="bg-gray-100 relative rounded-md divide-y divide-dashed">
        <div className="flex flex-row gap-4 p-4">
          <Skeleton className="h-10 w-10" />
          <div className="relative overflow-auto">
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-80 mt-2" />
          </div>
        </div>
        <div className="flex flex-row gap-4 p-4">
          <Skeleton className="h-10 w-10" />
          <div className="relative overflow-auto">
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-80 mt-2" />
          </div>
        </div>
      </section>
    </section>
  </>
);
