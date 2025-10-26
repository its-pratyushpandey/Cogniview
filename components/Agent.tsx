"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Professional white theme styling applied
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}
interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [connectionError, setConnectionError] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error("VAPI Error:", error);
      
      // Handle specific VAPI errors gracefully
      const errorMessage = error.message || error.toString();
      
      if (errorMessage.includes('transport changed to disconnected')) {
        // Handle transport disconnection
        console.log("Transport disconnected, cleaning up...");
        setConnectionError("Connection lost. Please try starting the interview again.");
        setCallStatus(CallStatus.INACTIVE);
        return;
      }
      
      if (errorMessage.includes('Meeting ended due to ejection') || errorMessage.includes('Meeting has ended')) {
        // Handle meeting ejection - this is normal when ending a call
        console.log("Meeting ended, cleaning up...");
        setCallStatus(CallStatus.FINISHED);
        return;
      }
      
      // For other errors, set status to inactive and show user-friendly message
      setConnectionError("Voice connection error. Please try again.");
      setCallStatus(CallStatus.INACTIVE);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    try {
      // Check if VAPI is properly configured
      if (!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN || process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN === 'your_vapi_web_token_here') {
        setConnectionError("VAPI is not configured. Please contact support to set up the voice interview feature.");
        return;
      }

      // Clear any previous connection errors
      setConnectionError("");
      setCallStatus(CallStatus.CONNECTING);

      if (type === "generate") {
        // For generation type, use a modified interviewer assistant
        const generatorAssistant: CreateAssistantDTO = {
          ...interviewer,
          name: "Interview Generator",
          firstMessage: `Hello ${userName}! I'm here to help you create a personalized mock interview. Let's gather some information about the type of interview you'd like to practice.`,
        };

        // Update the system message for the generator
        if (generatorAssistant.model && 'messages' in generatorAssistant.model) {
          generatorAssistant.model.messages = [
            {
              role: "system",
              content: `You are an AI Interview Generator assistant helping ${userName} (ID: ${userId}) create a personalized mock interview. 

Your role is to gather information about:
1. Job role/position they're applying for
2. Experience level (Junior, Mid, Senior)  
3. Type of interview focus (Technical, Behavioral, or Mixed)
4. Tech stack or skills they want to practice
5. Number of questions they want (typically 5-10)

Keep the conversation friendly, professional, and focused. Ask one question at a time and wait for their response before moving to the next topic.

Once you gather all the information, summarize what you've collected and let them know their personalized interview questions will be generated shortly.

Important: This is a voice conversation, so keep responses short and conversational. Don't list everything at once - have a natural dialogue.`,
            },
          ];
        }

        await vapi.start(generatorAssistant, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        // For interview type, use the regular interviewer
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      console.error("Error starting VAPI call:", error);
      setCallStatus(CallStatus.INACTIVE);
      
      // Set user-friendly error message
      setConnectionError("Unable to start the voice interview. Please check your internet connection and try again.");
      
      // Increment retry count for potential future retry logic
      setRetryCount(prev => prev + 1);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '2rem', 
      alignItems: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, var(--gray-50), white)',
      borderRadius: 'var(--border-radius-xl)',
      border: '1px solid var(--gray-200)'
    }}>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai.png"
              alt="AI Interviewer"
              width={100}
              height={100}
              style={{ 
                objectFit: 'cover',
                borderRadius: '50%',
                width: '100%',
                height: '100%',
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))'
              }}
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3 style={{ 
            textAlign: 'center', 
            color: 'var(--primary-600)', 
            margin: '1rem 0 0 0',
            fontSize: '1.25rem',
            fontWeight: 600
          }}>
            🤖 AI Interviewer
          </h3>
          <p style={{ 
            textAlign: 'center', 
            color: 'var(--gray-500)', 
            fontSize: '0.875rem',
            margin: '0.5rem 0 0 0'
          }}>
            {callStatus === "ACTIVE" && "🎤 Listening..."}
            {callStatus === "CONNECTING" && "🔄 Connecting..."}
            {callStatus === "INACTIVE" && "🤖 Ready to start"}
            {callStatus === "FINISHED" && "✅ Interview completed"}
          </p>
        </div>

        <div className="card-border" style={{ display: callStatus === "INACTIVE" ? 'block' : 'none' }}>
          <div className="card-content">
            <Image
              src="/user.png"
              alt="Your profile"
              width={120}
              height={120}
              style={{ 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: '3px solid var(--primary-100)',
                background: 'white'
              }}
            />
            <h3 style={{ 
              textAlign: 'center', 
              color: 'var(--gray-700)', 
              margin: '1rem 0 0 0',
              fontSize: '1.25rem',
              fontWeight: 600
            }}>
              👋 {userName}
            </h3>
            <p style={{ 
              textAlign: 'center', 
              color: 'var(--gray-500)', 
              fontSize: '0.875rem',
              margin: '0.5rem 0 0 0'
            }}>
              Interviewee
            </p>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="transcript">
            <p key={lastMessage} className="animate-fadeIn">
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Connection Error Display */}
      {connectionError && (
        <div style={{
          padding: '1rem',
          background: 'var(--error-50)',
          color: 'var(--error-600)',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--error-200)',
          textAlign: 'center',
          marginBottom: '1rem',
          maxWidth: '500px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <span>⚠️</span>
            <span>{connectionError}</span>
          </div>
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '1rem' 
      }}>
        {callStatus !== "ACTIVE" ? (
          <button 
            className={`btn-call ${callStatus === "CONNECTING" ? "connecting" : ""}`}
            onClick={() => handleCall()}
            disabled={callStatus === "CONNECTING"}
            style={{ position: 'relative' }}
          >
            <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "🎙️ Start Interview"
                : "🔄 Connecting..."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            🛑 End Interview
          </button>
        )}
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          fontSize: '0.75rem', 
          color: 'var(--gray-500)',
          textAlign: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <span>🎯 Voice Recognition</span>
          <span>⚡ Real-time Feedback</span>
          <span>🔒 Secure & Private</span>
          {callStatus === "ACTIVE" && <span style={{ color: 'var(--success-500)' }}>🟢 Connected</span>}
          {callStatus === "CONNECTING" && <span style={{ color: 'var(--warning-500)' }}>🟡 Connecting</span>}
        </div>
      </div>
    </div>
  );
};

export default Agent;
