import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ErrorPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getQueryParams = () => {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get("message");
    };
    const message = getQueryParams();
    setErrorMessage(message || "Unknown error");
  }, []);

  return (
    <>
      <div className="flex justify-center mt-12">
        <section className="flex flex-col items-center gap-2 mb-6">
          <h5 className="text-xl font-semibold">Something went wrong.</h5>
          <p className="text-lg text-red-500 font-bold">{errorMessage}!!!</p>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back Home
          </Button>
        </section>
      </div>
    </>
  );
};
