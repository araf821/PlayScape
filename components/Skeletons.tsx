export function CommentSectionLoader() {
  return (
    <div className="py-6">
      <div className="animate-pulse space-y-2">
        {/* Comment Input Skeleton */}
        <div className="h-4 w-28 rounded-lg bg-neutral-300" />
        <div className="h-20 w-full rounded-lg bg-neutral-300" />

        {/* Comment Skeleton */}
        <div className="flex items-center gap-2 pt-8">
          <div className="h-6 w-6 rounded-full bg-neutral-300" />
          <div className="h-4 w-28 rounded-lg bg-neutral-300" />
        </div>
        <div className="h-28 w-full rounded-lg bg-neutral-300" />
        <div className="flex gap-2">
          <div className="h-4 w-16 rounded-lg bg-neutral-300" />
          <div className="h-4 w-16 rounded-lg bg-neutral-300" />
        </div>

        {/* Comment Skeleton */}
        <div className="flex items-center gap-2 pt-8">
          <div className="h-6 w-6 rounded-full bg-neutral-300" />
          <div className="h-4 w-28 rounded-lg bg-neutral-300" />
        </div>
        <div className="h-28 w-full rounded-lg bg-neutral-300" />
        <div className="flex gap-2">
          <div className="h-4 w-16 rounded-lg bg-neutral-300" />
          <div className="h-4 w-16 rounded-lg bg-neutral-300" />
        </div>
      </div>
    </div>
  );
}

export function PostContentLoader() {
  return (
    <div className="py-4">
      <div className="animate-pulse space-y-2">
        <div className="h-4 w-[75%] rounded-lg bg-neutral-300" />
        <div className="h-4 w-full rounded-lg bg-neutral-300" />
        <div className="mx-auto h-20 w-20 rounded-lg bg-neutral-300" />
        <div className="h-28 w-full rounded-lg bg-neutral-300" />
      </div>
    </div>
  );
}
