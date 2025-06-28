import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { LoaderIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/lib/trpc";

const managePostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

type IPostForm = z.infer<typeof managePostSchema>;

function ManagePost() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { postId } = useParams();

  const isEditing = !!postId && !isNaN(Number(postId));

  const form = useForm<IPostForm>({
    mode: "all",
    resolver: zodResolver(managePostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { dirtyFields, isValid, isDirty },
  } = form;

  const {
    data: postDetails,
    isPending: isPostLoading,
    error: postError,
    fetchStatus: postQueryFetchStatus,
  } = useQuery(
    trpc.getById.queryOptions(Number(postId), { enabled: isEditing })
  );

  // Load fetched post data into form
  useEffect(() => {
    if (isEditing && postDetails) {
      reset({
        title: postDetails.post.title,
        content: postDetails.post.content,
      });
    }
  }, [isEditing, postDetails, reset]);

  const createPostMutation = useMutation(
    trpc.create.mutationOptions({
      onMutate: () => toast.loading("Creating post..."),
      onSuccess: ({ message }) => {
        toast.dismiss();
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: trpc.getAll.queryKey() });
        reset();
        navigate("/");
      },
      onError: (err) => {
        toast.dismiss();
        toast.error(err.message);
      },
    })
  );

  const updatePostMutation = useMutation(
    trpc.update.mutationOptions({
      onMutate: () => toast.loading("Updating post..."),
      onSuccess: ({ message }) => {
        toast.dismiss();
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: trpc.getAll.queryKey() });
        queryClient.invalidateQueries({
          queryKey: trpc.getById.queryKey(Number(postId)),
        });
        navigate("/");
      },
      onError: (err) => {
        toast.dismiss();
        toast.error(err.message);
      },
    })
  );

  const onSubmit: SubmitHandler<IPostForm> = (values) => {
    if (!isEditing) {
      createPostMutation.mutate(values);
    } else {
      updatePostMutation.mutate({
        id: Number(postId),
        ...(dirtyFields.title && { title: values.title }),
        ...(dirtyFields.content && { content: values.content }),
      });
    }
  };

  const isPending =
    createPostMutation.isPending || updatePostMutation.isPending;

  if (isEditing && isPostLoading && postQueryFetchStatus === "fetching") {
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center flex-col gap-3 text-center">
      <LoaderIcon className="text-muted-foreground size-12 animate-spin" />
      <p className="text-muted-foreground">Loading post details...</p>
    </div>;
  }

  if (isEditing && postError) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center text-destructive font-medium text-center">
        An error occurred while fetching post details!
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-5">
      <Card className="w-full sm:max-w-sm">
        <CardHeader>
          <CardTitle>{!isEditing ? "Create" : "Edit"} Post</CardTitle>
          <CardDescription>
            {!isEditing
              ? "Got something to say? Add a new post by entering a title and your content below."
              : "Need to make changes to the post? Update title or content and save changes."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-y-6"
            >
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter title"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter content"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={!isValid || !isDirty || isPending}
              >
                {!isEditing ? "Create Post" : "Save"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ManagePost;
