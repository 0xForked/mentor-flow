"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface JWTFormProps {
  callback(jwt: string): void;
}

const JWTFormSchema = z.object({
  jwt: z.string().refine(
    (value) => {
      const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
      return jwtRegex.test(value);
    },
    {
      message: "Invalid JWT format",
    },
  ),
});

export function JWTForm(props: JWTFormProps) {
  const form = useForm<z.infer<typeof JWTFormSchema>>({
    resolver: zodResolver(JWTFormSchema),
  });

  function onSubmit(data: z.infer<typeof JWTFormSchema>) {
    toast({
      title: "You submitted the following jwt values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    setTimeout(() => {
      props.callback(data.jwt);
    }, 500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="jwt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>JSON Web Token</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your access token here to display and validate your current account data!"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can obtain the <span className="underline">JWT</span> from
                your browser's developer console in the Network tab - You know
                lahh how to do that, right? #LOL.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitSuccessful}>
          {form.formState.isSubmitSuccessful && (
            <Loader2 className="w-4 animate-spin mr-1" />
          )}
          Submit
        </Button>
      </form>
    </Form>
  );
}
