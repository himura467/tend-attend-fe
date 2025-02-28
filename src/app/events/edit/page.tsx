import { DialogTemplate } from "@/components/templates/DialogTemplate";
import { NextPage } from "next";
import { EditEventsCalendarForm } from "@/components/organisms/specific/events/edit/EditEventsCalendarForm";

const EditEventsPage: NextPage = (): React.JSX.Element => {
  return (
    <DialogTemplate>
      <div className="w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Edit events</h1>
        </div>
        <EditEventsCalendarForm />
      </div>
    </DialogTemplate>
  );
};

export default EditEventsPage;
