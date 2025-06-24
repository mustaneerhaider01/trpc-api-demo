import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { LoaderIcon } from "lucide-react";

import { useTRPC } from "@/lib/trpc";

function PostDetails() {
  const { postId } = useParams();
  const trpc = useTRPC();

  const { data, isPending, error } = useQuery(
    trpc.getById.queryOptions(Number(postId))
  );

  if (isPending) {
    return (
      <div className="h-[70vh] flex items-center justify-center flex-col gap-3 text-center">
        <LoaderIcon className="text-muted-foreground size-12 animate-spin" />
        <p className="text-muted-foreground">Loading post details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex items-center justify-center flex-col gap-3 text-center text-destructive font-medium">
        An error occurred while fetching post details!
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-5 py-10">
      <h1 className="text-4xl font-semibold mb-3">{data?.post.title}</h1>
      <p className="text-lg text-neutral-700 mb-2">{data?.post.content}</p>
      <p className="italic text-muted-foreground text-sm font-medium">
        Posted on: {new Date(data?.post.createdAt * 1000).toLocaleDateString()}
      </p>
    </div>
  );
}

export default PostDetails;
