import MeetingPageClient from "@/components/meeting/MeetingPageClient";

interface MeetingByPathPageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default async function MeetingByPathPage({ params }: MeetingByPathPageProps) {
  const { meetingId } = await params;
  return <MeetingPageClient meetingId={meetingId} />;
}