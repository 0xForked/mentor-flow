import { OAuthProvider } from "@/lib/enums";
import { useUserStore } from "@/stores/user";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { ArrowLeftIcon } from "lucide-react";

export const InstalledApp = (v: { provider: OAuthProvider }) => {
  const { availability } = useUserStore();

  const onCalendarStateChange = (state: boolean, provider: string) => {
    console.log(state, provider);
  };

  return (<>
    <section className="bg-gray-100 relative rounded-md divide-y divide-dashed">
      {availability?.installed_apps?.calendars
        ?.filter((item) => item.provider === v.provider)
        .map((item, index) => (
          <div className="flex flex-row gap-4 p-4" key={index}>
            <img className="h-8 w-8 mt-2" src={item.logo} alt="google-calendar-logo" />
            <div className="relative overflow-auto">
              <h5 className="text-md font-semibold">{item.name}</h5>
              <p className="text-xs text-gray-600">
                Toggle the calendars you want to check for conflicts to prevent double bookings
              </p>
              <div className="flex flex-row items-center gap-2 mt-4">
                <Switch
                  defaultChecked={true}
                  onCheckedChange={(checked: boolean) => onCalendarStateChange(checked, v.provider)}
                />
                <span className="text-xs">{item.email} (Calendar)</span>
                {item.is_default && (
                  <Badge className="bg-gray-200 text-black hover:bg-gray-200 hover:text-black py-1 rounded-sm">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Adding events to
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      {availability?.installed_apps?.conferencing
        ?.filter((item) => item.provider === v.provider)
        .map((item, index) => (
          <div className="flex flex-row gap-4 p-4" key={index}>
            <img className="h-10 w-10" src={item.logo} alt="google-meet-logo" />
            <div className="relative overflow-auto">
              <h5 className="text-md font-semibold">
                {item.name}
                {item.is_default && (
                  <Badge className="bg-green-200 text-green-800 hover:bg-green-200 hover:text-green-800 py-1 ml-2 rounded-sm">
                    <span className="text-xs">Default</span>
                  </Badge>
                )}
              </h5>
              <p className="text-xs text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
    </section>
  </>)
};
