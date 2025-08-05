import { Skeleton } from "@/components/ui/skeleton"

export default function LoginLoading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <div className="flex flex-col gap-6 md:w-1/2">
            <Skeleton className="h-6 w-32" />
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex flex-col gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-4 w-40 mx-auto" />
            </div>
          </div>
          <div className="relative hidden bg-muted md:block md:w-1/2">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
