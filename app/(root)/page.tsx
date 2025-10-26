import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import InterviewCard from "@/components/InterviewCard";
import SkeletonCard from "@/components/SkeletonCard";
import ErrorBoundary from "@/components/ErrorBoundary";
import { EmptyState } from "@/components/LoadingComponents";
import { PrimaryButton, SecondaryButton, PurpleButton } from "@/components/InteractiveButton";

async function Home() {
  const user = await getCurrentUser();
  
  // Use safe calls with fallback to empty arrays
  const [userInterviews, allInterview] = await Promise.allSettled([
    user?.id ? getInterviewsByUserId(user.id) : Promise.resolve([]),
    user?.id ? getLatestInterviews({ userId: user.id }) : Promise.resolve([]),
  ]);

  const userInterviewsData = userInterviews.status === 'fulfilled' ? userInterviews.value || [] : [];
  const allInterviewData = allInterview.status === 'fulfilled' ? allInterview.value || [] : [];

  const hasPastInterviews = userInterviewsData.length > 0;
  const hasUpcomingInterviews = allInterviewData.length > 0;

  return (
    <>
      <section className="card-cta">
        <div style={{ flex: 1, maxWidth: '500px', zIndex: 2, position: 'relative' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            lineHeight: 1.2, 
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Master Your Next Interview with AI
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--gray-600)', 
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            The AI-powered mock interview platform built for engineering students to ace tech interviews. 
            Practice real interview questions & get instant feedback.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <PrimaryButton href="/interview">
              🚀 Start Your Interview
            </PrimaryButton>
            
            <div style={{
              padding: '0.5rem 1rem',
              background: 'var(--success-50)',
              color: 'var(--success-600)',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '1px solid var(--success-100)'
            }}>
              ✓ Free to Use
            </div>
          </div>
        </div>

        <div style={{ flexShrink: 0, position: 'relative', zIndex: 2 }}>
          <Image
            src="/hero.png"
            alt="AI Interview Assistant"
            width={400}
            height={400}
            priority
            style={{ 
              width: 'auto', 
              height: 'auto', 
              maxWidth: '400px',
              animation: 'bounce 3s ease-in-out infinite'
            }}
            className="max-sm:hidden"
          />
        </div>
      </section>

      <ErrorBoundary>
        <section style={{ marginTop: '3rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2>Your Interviews</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', margin: 0 }}>
                Track your progress and review past interviews
              </p>
            </div>
            {hasPastInterviews && (
              <div style={{
                padding: '0.5rem 1rem',
                background: 'var(--primary-50)',
                color: 'var(--primary-600)',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: '1px solid var(--primary-200)'
              }}>
                {userInterviewsData.length} Interview{userInterviewsData.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          
          <div className="interviews-section">
            {hasPastInterviews ? (
              userInterviewsData.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  id={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))
            ) : (
              <div style={{ 
                gridColumn: '1 / -1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
                padding: '3rem 2rem',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', opacity: 0.3 }}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} style={{ display: 'none' }} className="md:flex flex-col gap-2 items-center">
                      <SkeletonCard />
                      <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--gray-400)' }}>
                        Ready when you are 👊
                      </p>
                    </div>
                  ))}
                </div>
                
                <EmptyState
                  title="No interviews yet"
                  description="You haven't created any interviews yet. Start your first mock interview to practice and improve your skills."
                  action={
                    <PurpleButton href="/interview">
                      Start Your First Interview
                    </PurpleButton>
                  }
                />
              </div>
            )}
          </div>
        </section>
      </ErrorBoundary>

      <ErrorBoundary>
        <section style={{ marginTop: '3rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2>Featured Interviews</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', margin: 0 }}>
                Explore popular interview templates from the community
              </p>
            </div>
            {hasUpcomingInterviews && (
              <div style={{
                padding: '0.5rem 1rem',
                background: 'var(--purple-50)',
                color: 'var(--purple-600)',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: '1px solid var(--purple-200)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🌟 {allInterviewData.length} Available
              </div>
            )}
          </div>
          
          <div className="interviews-section">
            {hasUpcomingInterviews ? (
              allInterviewData.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  id={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))
            ) : (
              <div style={{ 
                gridColumn: '1 / -1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
                padding: '3rem 2rem',
                textAlign: 'center'
              }}>
                <EmptyState
                  title="No featured interviews available"
                  description="Check back later for new interview opportunities from other users, or create your own to share with the community."
                  action={
                    <SecondaryButton href="/interview">
                      Create Your Own Interview
                    </SecondaryButton>
                  }
                />
              </div>
            )}
          </div>
        </section>
      </ErrorBoundary>

      <footer style={{ 
        marginTop: '4rem', 
        padding: '3rem 0 2rem',
        borderTop: '1px solid var(--gray-200)',
        background: 'linear-gradient(135deg, var(--gray-50), white)',
        textAlign: 'center'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '1rem' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--gray-600)'
          }}>
            <span>Crafted with</span>
            <span style={{ color: 'red', fontSize: '1rem' }}>💖</span>
            <span>by Pratyush</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '2rem', 
            fontSize: '0.75rem', 
            color: 'var(--gray-500)',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <span>🤖 AI-Powered</span>
            <span>⚡ Real-time Feedback</span>
            <span>🎯 Practice Focused</span>
            <span>📈 Progress Tracking</span>
          </div>
          
          <p style={{ 
            fontSize: '0.75rem', 
            color: 'var(--gray-400)', 
            margin: 0,
            fontStyle: 'italic'
          }}>
            © 2024 Cogniview. Empowering your interview success.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Home;
