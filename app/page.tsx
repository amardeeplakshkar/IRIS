'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { date, z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useMessages } from "@/components/provider/MessagesPorvider";
import { Globe } from "@/components/magicui/globe";
import { HeroBentoGrid } from "@/components/magicui/HeroBentoGrid";
import { ScrollArea } from "@/components/ui/scroll-area";

const formScema = z.object({
    value: z.string()
        .min(1, { message: "Value is required" })
});

const ProjectForm = () => {
    const router = useRouter();
    const { initialPrompt, setInitialPrompt, setInitialMessages, initialMessages } = useMessages();
    const queryClient = useQueryClient();
    const clerk = useClerk();
    const trpc = useTRPC();
    const form = useForm<z.infer<typeof formScema>>({
        resolver: zodResolver(formScema),
        defaultValues: {

            value: "",

        }
    });

    const createProject = useMutation(trpc.chat.create.mutationOptions({
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: trpc.chat.getMany.queryKey() });
            router.push(`/chat/${data.id}`);
            setInitialMessages([]);
            setInitialPrompt('');
            // queryClient.invalidateQueries(
            //     trpc.usage.status.queryOptions()
            //   );
        },
        onError: (error) => {
            toast.error(error.message);
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }

            if (error.data?.code === "TOO_MANY_REQUESTS") {
                router.push("/pricing");
            }
        },
    }));

    const onSubmit = async (values: z.infer<typeof formScema>) => {

        await createProject.mutateAsync({
            value: values.value,
        })
        setInitialPrompt(values.value);
    }

    const onSelect = (value: string) => {
        form.setValue("value", value, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
        });
    };

    const isPending = createProject.isPending;
    const isButtonDisbled = isPending || !form.formState.isValid;
    const [isFocuesd, setIsFocused] = useState(false);


    return (
        <ScrollArea className="h-[90dvh]">
        <div className="mx-auto max-w-5xl p-4 flex flex-col gap-4 relative">
            <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
                IRIS
            </span>
            <Globe className="top-28" />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={cn("mt-[40dvh] relative border min-w-sm sm:min-w-md md:min-w-lg lg:min-w-xl p-4 pt-1 rounded-xl bg-sidebar transition-all",
                        isFocuesd && "shadow-xs",

                    )}
                >

                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (

                            <TextareaAutosize
                                {...field}
                                disabled={isPending}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                minRows={2}
                                maxRows={8}
                                className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                                placeholder="what would you like to build?"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        form.handleSubmit(onSubmit)(e);
                                    }

                                }}
                            />

                        )}
                    />

                    <div className="flex gap-x-2 items-end justify-between pt-2">
                        <div className="text-[10px] text-muted-foreground font-mono">

                            <kbd className="ml-auto pointer-events-auto inline-flex h-5 select-none items-center
       gap-1 rounded border bg-muted  px-1.5 font-mono text=[10px] font-medium ">

                                <span>&#8984;</span>Enter
                            </kbd>
                            &nbsp;to Submit

                        </div>

                        <Button
                            disabled={isButtonDisbled}
                            className={cn("size-8 rounded-full",
                                isButtonDisbled && "bg-muted-foreground border"
                            )}>
                            {isPending ? (<Loader2Icon
                                className="size-4 animate-spin" />) :
                                (
                                    <ArrowUpIcon />

                                )

                            }


                        </Button>
                    </div>
                </form>

                <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
                    { }
                </div>
            </Form>
            <HeroBentoGrid />
        </div>
        </ScrollArea>
    )
}
export default ProjectForm 