import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditIcon, LoaderIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { useTRPC } from "@/lib/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Home() {
  const trpc = useTRPC();
  const { data, isFetching, error } = useQuery(trpc.getAll.queryOptions());
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deletePostMutation = useMutation(
    trpc.delete.mutationOptions({
      onMutate: () => toast.loading("Deleting post..."),
      onSuccess: ({ message }) => {
        toast.dismiss();
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: trpc.getAll.queryKey() });
      },
      onError: (err) => {
        toast.dismiss();
        toast.error(err.message);
      },
    })
  );

  if (isFetching) {
    return (
      <div className="h-[70vh] flex items-center justify-center flex-col gap-3 text-center">
        <LoaderIcon className="text-muted-foreground size-12 animate-spin" />
        <p className="text-muted-foreground">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex items-center justify-center flex-col gap-3 text-center text-destructive font-medium">
        An error occurred while fetching the posts!
      </div>
    );
  }

  if (data?.posts.length === 0) {
    return (
      <div className="h-[70vh] text-center flex items-center justify-center text-lg font-medium">
        Currently, there is no post to display!
      </div>
    );
  }

  return (
    <div className="px-5 py-10 space-y-5 max-w-7xl mx-auto w-full">
      <h2 className="text-3xl max-w-7xl font-semibold">All Posts</h2>
      <section className="flex flex-col gap-y-6">
        {data?.posts?.map((post) => (
          <Card
            onClick={() => navigate(`/posts/${post.id}`)}
            key={post.id}
            className="cursor-pointer"
          >
            <CardHeader>
              <CardTitle className="text-lg">{post.title}</CardTitle>
              <CardDescription className="text-base">
                {post.content}
              </CardDescription>
            </CardHeader>
            <CardContent className="pr-0">
              <CardFooter className="justify-end gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/posts/${post.id}/edit`);
                  }}
                  disabled={deletePostMutation.isPending}
                >
                  <EditIcon />
                  Edit
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePostMutation.mutate(post.id);
                  }}
                  variant="destructive"
                  disabled={deletePostMutation.isPending}
                >
                  <Trash2Icon />
                  Delete
                </Button>
              </CardFooter>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

export default Home;
