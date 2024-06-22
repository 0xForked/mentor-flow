import { Button } from "@/components/ui/button";
import { User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  return (<>
    <div className="flex flex-col justify-center mt-12">
      <section className="flex flex-col items-center gap-2 mb-6">
        <h5 className="text-xl font-semibold">Choose Your Role</h5>
        <p className="text-sm text-gray-400 font-light">Please select whether you want to proceed as a Mentor or Mentee.</p>
      </section>
      <section className="flex justify-center gap-12">
        <Button onClick={() => navigate("/mentor")} variant="outline" className="flex flex-col h-40 w-72">
          <User2 className="mb-4 w-16 h-16" />
          Go as Mentor
        </Button>
        <Button onClick={() => navigate("/mentee")} variant="outline" className="flex flex-col h-40 w-72">
          <User2 className="mb-4 w-16 h-16" />
          Go as Mentee
        </Button>
      </section>
    </div >
  </>)
}
