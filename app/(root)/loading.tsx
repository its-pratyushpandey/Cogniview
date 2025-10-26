import { LoadingState } from "@/components/LoadingComponents";

export default function Loading() {
  return (
    <div className="root-layout">
      <div 
        className="card-cta border-2 animate-gradient-x"
        style={{
          background: 'linear-gradient(-45deg, var(--primary-100), var(--primary-50), var(--accent-100), var(--primary-200))',
          borderImage: 'linear-gradient(135deg, var(--primary-400), var(--accent-300), var(--primary-300)) 1'
        }}
      >
        <div className="flex flex-col gap-6 max-w-lg">
          <div 
            className="h-8 rounded-lg animate-pulse"
            style={{ backgroundColor: 'var(--neutral-300)' }}
          ></div>
          <div 
            className="h-4 rounded animate-pulse"
            style={{ backgroundColor: 'var(--neutral-300)' }}
          ></div>
          <div 
            className="h-10 rounded-full animate-pulse w-48"
            style={{ backgroundColor: 'var(--neutral-300)' }}
          ></div>
        </div>
        <div 
          className="w-[400px] h-[400px] rounded-lg animate-pulse max-sm:hidden"
          style={{ backgroundColor: 'var(--neutral-300)' }}
        ></div>
      </div>
      
      <section className="flex flex-col gap-6 mt-8">
        <div 
          className="h-8 rounded animate-pulse w-48"
          style={{ backgroundColor: 'var(--neutral-300)' }}
        ></div>
        <LoadingState message="Loading your interviews..." />
      </section>
      
      <section className="flex flex-col gap-6 mt-8">
        <div 
          className="h-8 rounded animate-pulse w-48"
          style={{ backgroundColor: 'var(--neutral-300)' }}
        ></div>
        <LoadingState message="Loading featured interviews..." />
      </section>
    </div>
  );
}