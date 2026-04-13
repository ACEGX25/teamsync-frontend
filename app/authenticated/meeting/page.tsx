import MeetingPageClient from "@/components/meeting/MeetingPageClient";

interface MeetingPageProps {
  searchParams?: {
    meetingId?: string;
  };
}

export default function MeetingPage({ searchParams }: MeetingPageProps) {
  const meetingId = searchParams?.meetingId || crypto.randomUUID();

  return <MeetingPageClient meetingId={meetingId} />;
}
