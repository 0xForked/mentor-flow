import { InstalledAppType, OAuthProvider } from "@/lib/enums";
import { useUserMentorStore } from "@/stores/userMentor";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon } from "lucide-react";
import { App } from "@/lib/user";
import { useAPI } from "@/hooks/useApi";
import { handleError } from "@/lib/http";
import { useMutation } from "react-query";
import { Button } from "../ui/button";

export const InstalledApp = ({ provider }: { provider: OAuthProvider }) => {
  const { availability, setUserAvailability } = useUserMentorStore();
  const { updateAvailability, disconnect3rdPartyAccount } = useAPI();

  const saveChanges = useMutation(updateAvailability, {
    onSuccess: (resp) => {
      const availabilityData = resp?.data;
      setUserAvailability(availabilityData);
    },
    onError: (error) => handleError(error),
  });

  const onCalendarStateChange = (state: boolean, id: string) => {
    if (!id) return;
    saveChanges.mutate(
      JSON.stringify({
        apps: [
          {
            id: id,
            type: "calendar",
            must_sync: state,
          },
        ],
      }),
    );
  };

  const onDisconnected = (provider: OAuthProvider) => {
    if (!provider) return;
    disconnect.mutate(provider);
  }

  const disconnect = useMutation(disconnect3rdPartyAccount, {
    onSuccess: () => {
      window.location.href = "/mentor";
    },
    onError: (error) => handleError(error),
  });

  const renderAppDetails = (index: number, app: App, type: InstalledAppType) => (
    <div className="flex flex-row justify-between items-center" key={index}>
      <div className="flex flex-row gap-4 p-4">
        <img
          className={type === InstalledAppType.CALENDAR ? "h-8 w-8 mt-2" : "h-10 w-10"}
          src={app.logo}
          alt={`${provider}-${app.name}-logo`}
        />
        <div className="relative overflow-auto">
          <h5 className="text-md font-semibold">
            {app.name}
            {app.is_default && type === InstalledAppType.CONFERENCING && (
              <Badge className="bg-green-200 text-green-800 hover:bg-green-200 hover:text-green-800 py-1 ml-2 rounded-sm">
                <span className="text-xs">Default</span>
              </Badge>
            )}
          </h5>
          <p className="text-xs text-gray-600">{app.description}</p>
          {type === InstalledAppType.CALENDAR && (
            <div className="flex flex-row items-center gap-2 mt-4">
              <Switch
                defaultChecked={app.must_sync}
                onCheckedChange={(checked) => onCalendarStateChange(checked, app.id)}
              />
              <span className="text-xs">{app.email} (Calendar)</span>
              {app.is_default && (
                <Badge className="bg-gray-200 text-black hover:bg-gray-200 hover:text-black py-1 rounded-sm">
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Adding events to
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
      {type === InstalledAppType.CALENDAR && (
        <Button
          variant="destructive"
          className="mr-4" onClick={() => onDisconnected(app.provider as OAuthProvider)}
        >
          Disconnect
        </Button>
      )}
    </div>
  );

  return (
    <section className="bg-gray-100 relative rounded-md divide-y divide-dashed">
      {(availability?.installed_apps?.calendars || [])
        .filter((app) => app.provider === provider)
        .map((app, index) => renderAppDetails(index, app, InstalledAppType.CALENDAR))}
      {(availability?.installed_apps?.conferencing || [])
        .filter((app) => app.provider === provider)
        .map((app, index) => renderAppDetails(index, app, InstalledAppType.CONFERENCING))}
    </section>
  );
};
