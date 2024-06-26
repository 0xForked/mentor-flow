import { useAPI } from "@/hooks/useApi";
import { handleError, HttpResponse, HttpResponseList } from "@/lib/http";
import { User } from "@/lib/user";
import { useUserMenteeStore } from "@/stores/userMentee";
import { useQuery } from "react-query";
import { MentorList } from "@/components/mentee/mentor-list";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { MentorBookingDialog } from "./booking-dialog";

export const MenteeContainer = () => {
  const { getMentors } = useAPI();
  const { setMentors } = useUserMenteeStore();

  const mentors = useQuery<HttpResponse<HttpResponseList<User>>>("mentors", getMentors, {
    onSuccess: (resp) => setMentors(resp?.data?.list || []),
    onError: (error) => handleError(error),
    retry: false,
  });

  if (mentors.isError || mentors.isLoading) {
    return (
      <main className="w-full">
        {mentors.isError && (
          <div className="flex flex-col">
            <CircleX className="h-14 w-14 mx-auto" />
            <h5 className="text-md font-semibold mx-auto mt-2">Error</h5>
            <p className="text-sm font-light mx-auto mb-4 text-center">Something went wrong!</p>
            <Button className="w-40 mx-auto" variant="link" onClick={() => mentors.refetch()}>
              Retry
            </Button>
          </div>
        )}
        {mentors.isLoading && <p className="w-fit mx-auto">Loading . . .</p>}
      </main>
    );
  }

  return (
    <div className="container xl:max-w-6xl mx-auto px-4">
      <div className="flex flex-col mb-12">
        <h5 className="text-lg font-semibold mx-auto mt-2">Available Mentors</h5>
        <p className="text-md font-light mx-auto mb-4 text-center">Find Your Mentor, Click to Schedule a Session!</p>
      </div>
      <MentorList />
      <MentorBookingDialog />
    </div>
  );
};
