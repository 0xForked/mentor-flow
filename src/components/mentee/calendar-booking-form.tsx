import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const BookingFormSchema = z.object({
  notes: z.string(),
});

export const CalendarBookingForm = ({ back }: { back: () => void }) => {
  const form = useForm<z.infer<typeof BookingFormSchema>>({
    resolver: zodResolver(BookingFormSchema),
  });

  function onSubmit(data: z.infer<typeof BookingFormSchema>) {
    setTimeout(() => console.log(data), 500);
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
            <Button type="submit" disabled={form.formState.isSubmitSuccessful}>
              {form.formState.isSubmitSuccessful && <Loader2 className="w-4 animate-spin mr-1" />}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
