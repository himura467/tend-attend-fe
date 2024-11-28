import CreateEventFormClient from "@/components/events/create-form-client";

export default function CreateEventForm() {
  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Create an Event</h1>
      </div>
      <CreateEventFormClient />
    </div>
  );
}
