import { useUserMentorStore } from "@/stores/userMentor";
import { PlusIcon } from "lucide-react";

export const OfferCard = () => {
  const { offers } = useUserMentorStore();

  return (
    <>
      <div className="flex flex-row flex-wrap gap-2 w-full justify-between">
        {offers?.filter((item) => item.type == "free_session")?.map((item, index) => (
          <button key={index} className="w-[49%] h-60 text-start border-2 p-2 rounded-sm hover:bg-gray-200 active:bg-gray-300">
            <div className="w-full h-full">
              {item.id}
              {item.description}
            </div>
          </button>
        ))}
        <button className="w-[49%] h-60 border-2 p-2 rounded-sm flex justify-center items-center hover:bg-gray-200 active:bg-gray-300">
          <PlusIcon className="w-12 h-12 text-gray-400"/>
        </button>
        {offers?.filter((item) => item.type != "free_session")?.map((item, index) => (
          <button key={index} className="w-[49%] h-60 text-start border-2 p-2 rounded-sm hover:bg-gray-200 active:bg-gray-300">
            <div className="w-full h-full">
              {item.id}
              {item.description}
            </div>
          </button>
        ))}
      </div>

    </>
  )
}
