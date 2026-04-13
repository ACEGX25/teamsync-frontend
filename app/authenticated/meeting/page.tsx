import MeetingPageClient from "@/components/meeting/MeetingPageClient";

interface MeetingPageProps {
  searchParams?: {
    meetingId?: string;
  };
}

export default function MeetingPage({ searchParams }: MeetingPageProps) {
  const meetingId = searchParams?.meetingId || "";

  return <MeetingPageClient meetingId={meetingId} />;
}
