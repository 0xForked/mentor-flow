import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAPI } from "@/hooks/useApi";
import { handleError } from "@/lib/http";
import { useMutation } from "react-query";
import { Loader2 } from "lucide-react";

interface CancelBookingFormProps {
  bookingId: string,
  cancel(): void
  submit(): void;
}

const CancelBookingFormSchema = z.object({
  reason: z.string().optional(),
});

export function CancelBookingFormForm(props: CancelBookingFormProps) {
  const { requestCancelBooking } = useAPI();
  const form = useForm<z.infer<typeof CancelBookingFormSchema>>({
    resolver: zodResolver(CancelBookingFormSchema),
  });

  const cancelBooking = useMutation(requestCancelBooking, {
    onSuccess: () => props.submit(),
    onError: (error) => handleError(error),
  });

  function onSubmit(data: z.infer<typeof CancelBookingFormSchema>) {
    let reason = ""
    if (data.reason != "") {
      reason = JSON.stringify(data)
    }
    cancelBooking.mutate({ id: props.bookingId, body: reason });
  }

  return (
    <Form {...form}>
      <hr />
      <h1 className="text-lg font-semibold my-4">
        Request cancel
      </h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 flex flex-col gap-2">
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason (*optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your cancel reason!"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="ml-auto space-x-4">
          <Button variant="ghost" onClick={props.cancel}>Cancel</Button>
          <Button type="submit" disabled={cancelBooking.isLoading}>
            {cancelBooking.isLoading && <Loader2 className="w-4 animate-spin mr-1" />}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
