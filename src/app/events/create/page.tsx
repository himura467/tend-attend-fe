import { DialogTemplate } from "@/components/templates/DialogTemplate";
import { NextPage } from "next";
import { CreateEventForm } from "@/components/organisms/specific/events/CreateEventForm";
import { rr } from "@/lib/utils/reverse-router";
import { formatUrl } from "@/lib/utils/url";

const CreateEventPage: NextPage = (): React.JSX.Element => {
  return (
    <DialogTemplate>
      <div className="w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Create an Event</h1>
        </div>
        <CreateEventForm location={formatUrl(rr.index().href)} />
      </div>
    </DialogTemplate>
  );
};

export default CreateEventPage;
