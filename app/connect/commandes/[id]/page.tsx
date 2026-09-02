import { TrackingPage } from "@/components/TrackingPage";

export default async function OrderTrackingRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TrackingPage orderId={id} />;
}
