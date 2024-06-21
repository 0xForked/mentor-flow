import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { timezoneReference } from "@/lib/reference";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "./ui/use-toast";
import { useUserStore } from "@/states/userStore";
import { useAPI } from "@/hooks/useApi";

const AvailabilityFormSchema = z.object({
  label: z.string(),
  timezone: z.string(),
});

export function NewAvailabilityDialog() {
  const [open, setOpen] = useState(false);
  const { setUserAvailability } = useUserStore();
  const { useCreateAvailability } = useAPI();
  const createAvailability = useCreateAvailability();

  const form = useForm<z.infer<typeof AvailabilityFormSchema>>({
    resolver: zodResolver(AvailabilityFormSchema),
    defaultValues: {
      label: "Working Days",
      timezone: "Asia/Singapore",
    },
  });

  async function onSubmit(data: z.infer<typeof AvailabilityFormSchema>) {
    try {
      const response = await createAvailability.mutateAsync({
        label: data.label,
        timezone: data.timezone,
      });
      const availabilityData = response?.data ?? null;
      setUserAvailability(availabilityData);
      setOpen(false);
      toast({
        title: 'Success!',
        description: 'Availability created successfully.',
      });
    } catch (error) {
      let em = "An unknown error occurred";
      if (error instanceof Error) {
        em = error.message;
      }
      toast({
        title: "Error create new Availability",
        description: <>{em}</>,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button className="w-36 mx-auto mt-4" onClick={() => setOpen(true)}>
          New Availability
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Your Availability</DialogTitle>
          <DialogDescription>
            By setting your availability, you ensure others can see when you're
            free and schedule accordingly.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-6"
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} className="col-span-3" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {timezoneReference.map((time, index) => (
                            <SelectItem key={index} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-auto ml-auto" disabled={createAvailability.isLoading}>
              {createAvailability.isLoading && <Loader2 className="w-4 animate-spin mr-1" />}
              Save changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
