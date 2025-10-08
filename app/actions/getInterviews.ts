"use server";

async function getInterviews(page?: number, limit?: number) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/interview`);
  if (page) url.searchParams.append("page", page.toString());
  if (limit) url.searchParams.append("limit", limit.toString());

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const interviewData = await res.json();
  if (!res.ok) {
    throw new Error(interviewData.message);
  }

  const interviews = interviewData.data.data;
  return interviews;
}

export default getInterviews;
