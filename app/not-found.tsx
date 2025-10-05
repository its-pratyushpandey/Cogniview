import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="root-layout">
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-8xl font-bold text-purple-600 mb-4">404</h1>
            <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-gray-400 mb-8">
              The interview or page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button asChild className="w-full btn-primary">
              <Link href="/">Go Home</Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/interview">Start New Interview</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}