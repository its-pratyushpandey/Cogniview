import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    userId: user?.id!,
  });

  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center ">
        <div className="flex flex-row gap-5">
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.png" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span style={{ color: 'var(--primary-600)', fontWeight: 'bold' }}>
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          <div className="flex flex-row gap-2">
            <Image src="/calender.png" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment}</p>

      <div className="flex flex-col gap-4">
        <h2>Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3>Strengths</h3>
        <ul>
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="buttons">
        <Button 
          asChild
          style={{
            background: 'white',
            color: 'var(--primary-600)',
            border: '2px solid var(--primary-600)',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            flex: 1,
            transition: 'all 0.15s'
          }}
        >
          <Link href="/" style={{ 
            display: 'flex', 
            width: '100%', 
            justifyContent: 'center',
            textDecoration: 'none',
            color: 'inherit'
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>
              Back to dashboard
            </span>
          </Link>
        </Button>

        <Button 
          asChild
          style={{
            background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            border: 'none',
            boxShadow: 'var(--shadow-md)',
            flex: 1,
            transition: 'all 0.15s'
          }}
        >
          <Link
            href={`/interview/${id}`}
            style={{ 
              display: 'flex', 
              width: '100%', 
              justifyContent: 'center',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>
              Retake Interview
            </span>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
