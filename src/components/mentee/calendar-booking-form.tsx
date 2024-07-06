import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAPI } from "@/hooks/useApi";
import { handleError } from "@/lib/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";
import { useQueryClient } from 'react-query'
import { toast } from "sonner";

const BookingFormSchema = z.object({
  notes: z.string(),
});

export const CalendarBookingForm = ({
  cb,
  back,
  id,
  tz,
  dt,
}: {
  cb: () => void;
  back: () => void;
  id?: string;
  tz?: string;
  dt?: string;
}) => {
  const form = useForm<z.infer<typeof BookingFormSchema>>({
    resolver: zodResolver(BookingFormSchema),
  });
  const { createNewBooking } = useAPI();
  const queryClient = useQueryClient()

  const createBooking = useMutation(createNewBooking, {
    onSuccess: () => {
      toast.dismiss();
      queryClient.invalidateQueries('bookings')
      cb();
    },
    onError: (error) => handleError(error),
  });

  function onSubmit(data: z.infer<typeof BookingFormSchema>) {
    createBooking.mutate(
      JSON.stringify({
        mentor_id: id,
        timezone: tz,
        booking_time: dt,
        booking_notes: data.notes,
      }),
    );
  }

  return (
    <div className="flex flex-col gap-4 w-[380px] pt-4">
      <Form {...form}>
        <form className="flex flex-col w-full h-full" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please share anything that will help prepare for our meeting!"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="absolute bottom-6 right-6 flex gap-4">
            <Button variant="ghost" type="button" onClick={() => back()}>
              Back
            </Button>
            <Button type="submit" disabled={createBooking.isLoading}>
              {createBooking.isLoading && <Loader2 className="w-4 animate-spin mr-1" />}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
