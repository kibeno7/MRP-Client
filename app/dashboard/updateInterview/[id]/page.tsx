import UpdateInterviewForm from "@/components/custom/UpdateInterview";
import { Interview } from "@/types/Interview";
import axios from "axios";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/interview/${id}`
  );
  const { interview } = res.data.data;
  console.log(interview.rounds[0].questions);
  return (
    <div>
      <h1>Update Interview</h1>
      <UpdateInterviewForm interview={interview as Interview} />
    </div>
  );
}
