import Image from "next/image";
import { cn, getTechLogos } from "@/lib/utils";
interface TechIconProps {
  techStack: string[];
}
const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
  const techIcons = await getTechLogos(techStack);

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-gray-100 border border-gray-200 rounded-full p-2 flex items-center justify-center hover:bg-gray-200 transition-colors",
            index >= 1 && "-ml-3"
          )}
          style={{
            background: 'var(--gray-100)',
            border: '1px solid var(--gray-200)',
            borderRadius: '50%',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <span 
            className="absolute bottom-full mb-1 hidden group-hover:flex px-2 py-1 text-xs text-white bg-gray-700 rounded-md shadow-md"
            style={{
              position: 'absolute',
              bottom: '100%',
              marginBottom: '0.25rem',
              display: 'none',
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              color: 'white',
              background: 'var(--gray-700)',
              borderRadius: '6px',
              boxShadow: 'var(--shadow-md)',
              whiteSpace: 'nowrap',
              zIndex: 10
            }}
          >
            {tech}
          </span>
          <Image
            src={url}
            alt={tech}
            width={100}
            height={100}
            className="size-5"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
