import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import { getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  id,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && id
      ? await getFeedbackByInterviewId({
          interviewId: id,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const badgeStyles = {
    Behavioral: { background: 'var(--primary-100)', color: 'var(--primary-700)' },
    Mixed: { background: 'var(--purple-100)', color: 'var(--purple-700)' },
    Technical: { background: 'var(--gray-100)', color: 'var(--gray-700)' },
  }[normalizedType] || { background: 'var(--gray-100)', color: 'var(--gray-700)' };

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-interview animate-fadeIn" style={{ 
      minHeight: '24rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}>
      <div>
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          ...badgeStyles
        }}>
          {normalizedType}
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '1.5rem' 
        }}>
          <Image
            src={getRandomInterviewCover()}
            alt="cover-image"
            width={90}
            height={90}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--primary-100)',
              padding: '4px',
              background: 'white'
            }}
          />
        </div>

        <h3 style={{ 
          textAlign: 'center', 
          marginBottom: '1rem',
          textTransform: 'capitalize',
          color: 'var(--gray-800)',
          fontWeight: 600
        }}>
          {role} Interview
        </h3>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '1rem',
          fontSize: '0.875rem',
          color: 'var(--gray-500)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Image
              src="/calender.png"
              width={18}
              height={18}
              alt="calendar"
              style={{ opacity: 0.7 }}
            />
            <span>{formattedDate}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Image 
              src="/star.png" 
              width={18} 
              height={18} 
              alt="star"
              style={{ opacity: 0.7 }}
            />
            <span style={{ 
              color: feedback?.totalScore ? 'var(--success-600)' : 'var(--gray-400)',
              fontWeight: 600
            }}>
              {feedback?.totalScore || "---"} / 100
            </span>
          </div>
        </div>

        <p style={{ 
          fontSize: '0.875rem',
          lineHeight: 1.5,
          color: 'var(--gray-600)',
          marginBottom: '1.5rem',
          minHeight: '3rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {feedback?.finalAssessment ||
            "You haven't taken this interview yet. Take it now to improve your skills."}
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem' 
      }}>
        <DisplayTechIcons techStack={techstack} />

        <Button 
          asChild
          className="interview-card-button"
          style={{
            background: feedback ? 'var(--success-500)' : 'var(--primary-500)',
            color: 'white',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontWeight: 600,
            border: 'none',
            fontSize: '0.875rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
            cursor: 'pointer'
          }}
        >
          <Link
            href={
              feedback
                ? `/interview/${id}/feedback`
                : `/interview/${id}`
            }
          >
            {feedback ? "📊 Check Feedback" : "🎯 Start Interview"}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default InterviewCard;
