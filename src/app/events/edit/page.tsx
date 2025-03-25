import { DialogTemplate } from "@/components/templates/DialogTemplate";
import { NextPage } from "next";
import { EditEventsCalendarForm } from "@/components/organisms/specific/events/edit/EditEventsCalendarForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { rr } from "@/lib/utils/reverse-router";

const EditEventsPage: NextPage = (): React.JSX.Element => {
  return (
    <DialogTemplate>
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Edit events</h1>
          <Button variant="outline" asChild>
            <Link {...rr.events.attend.index()}>Attend Events</Link>
          </Button>
        </div>
        <EditEventsCalendarForm />
      </div>
    </DialogTemplate>
  );
};

export default EditEventsPage;
