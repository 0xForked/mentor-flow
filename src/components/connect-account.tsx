import { OAuthProvider } from "@/lib/enums";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import googleLogo from "../assets/google.webp";
import microsoftLogo from "../assets/microsoft.png";
import { capitalizeFirstChar } from "@/lib/utils";
import { handleError } from "@/lib/http";
import { toast } from "./ui/use-toast";
import { useAPI } from "@/hooks/useApi";
import { useMutation } from "react-query";

export const ConnectAccount = (v: { provider: OAuthProvider }) => {
  const { createNewOAuthConnectUrl } = useAPI();

  const createConnectUrl = useMutation(createNewOAuthConnectUrl, {
    onSuccess: (resp) => {
      const url = resp.data;
      if (url === "") {
        toast({
          title: "HTTP Error",
          description: `failed to generate ${v.provider} connect url`,
        })
        return;
      }
      window.location.href = url!;
    },
    onError: (error) => handleError(error),
  });

  const connectAccount = async (provider: OAuthProvider) => {
    if (!provider) return;
    createConnectUrl.mutate(provider)
  };

  return (<>
    <div className="relative">
      <div className="bg-gray-600 w-full h-full absolute top-0 left-0 opacity-40 rounded-md z-10"></div>
      <div className="bg-gray-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-12 py-4 rounded-md z-20 bg-opacity-60">
        <Button
          className="font-normal w-56"
          disabled={createConnectUrl.isLoading}
          onClick={() => connectAccount(v.provider)}
        >
          {createConnectUrl.isLoading ? (
            <Loader2 className="w-4 animate-spin mr-1" />
          ) : (
            <img
              className={v.provider == OAuthProvider.GOOGLE ? "w-6 h-6 mr-2" : "w-[20px] h-[20px] mr-2"}
              src={v.provider == OAuthProvider.GOOGLE ? googleLogo : microsoftLogo}
              alt={v.provider + "-logo"}
            />
          )}
          Connect with {capitalizeFirstChar(v.provider)}
        </Button>
      </div>
      <section className="bg-gray-100 relative rounded-md divide-y divide-dashed">
        <div className="flex flex-row gap-4 p-4">
          <img
            className="h-8 w-8 mt-2"
            src={
              v.provider == OAuthProvider.GOOGLE
                ? "https://stgreenskills001.blob.core.windows.net/assets/google-calendar-logo.svg"
                : "https://stgreenskills001.blob.core.windows.net/assets/outlock-calendar-logo.svg"
            }
            alt={v.provider + "-calendar-logo"}
          />
          <div className="relative overflow-auto">
            <h5 className="text-md font-semibold">
              {v.provider == OAuthProvider.GOOGLE ? "Google" : "Outlook"} Calendar
            </h5>
            <p className="text-xs text-gray-600 truncate overflow-hidden ...">
              {v.provider == OAuthProvider.GOOGLE
                ? `Google Calendar is a time management and scheduling service
              developed by Google. Allows users to create and edit events,
              with options available for type and time. Available to anyone
              that has a Gmail account on both mobile and web versions.`
                : ` Microsoft Office 365 is a suite of apps that helps you stay
                connected with others and get things done. It includes but is
                not limited to Microsoft Word, PowerPoint, Excel, Teams, OneNote
                and OneDrive. Office 365 allows you to work remotely with others
                on a team and collaborate in an online environment. Both web
                versions and desktop/mobile applications are available.`}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-4 p-4">
          <img
            className={v.provider == OAuthProvider.GOOGLE ? "h-10 w-10" : "h-8 w-8"}
            src={
              v.provider == OAuthProvider.GOOGLE
                ? "https://stgreenskills001.blob.core.windows.net/assets/google-meet-logo.webp"
                : "https://stgreenskills001.blob.core.windows.net/assets/microsoft-team-logo.svg"
            }
            alt={v.provider + "-conferece-logo"}
          />
          <div className="relative overflow-auto">
            <h5 className="text-md font-semibold">
              {v.provider == OAuthProvider.GOOGLE
                ? "Google Meet"
                : "Microsoft 365/Teams (Requires work/school account)"}
            </h5>
            <p className="text-xs text-gray-600 truncate overflow-hidden ...">
              {v.provider == OAuthProvider.GOOGLE
                ? ` Google Meet is Google's web-based video conferencing platform,
              designed to compete with major conferencing platforms.`
                : `Microsoft Teams is a business communication platform and
                collaborative workspace included in Microsoft 365. It offers
                workspace chat and video conferencing, file storage, and
                application integration. Both web versions and desktop/mobile
                applications are available. NOTE: MUST HAVE A WORK / SCHOOL
                ACCOUNT`}
            </p>
          </div>
        </div>
      </section>
    </div>
  </>)
};
