import PosterGeneration from "@/components/custom/PosterGeneration";
export default function Page({ params }: { params: { interviewId: string } }) {
    return (
        <PosterGeneration interviewId={params.interviewId} />
    );
}