import {
    BellIcon,
    CalendarIcon,
    FileTextIcon,
    GlobeIcon,
    InputIcon,
  } from "@radix-ui/react-icons";
  
  import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Brain, Cloud, Image } from "lucide-react";
import BlurVignette from "../ui/blur-vignette";
  
  const VideoBackground = ({ src, className }: { src: string; className?: string }) => (
  <video
    autoPlay
    loop
    muted
    playsInline
    className={`absolute inset-0 w-full h-full object-cover ${className}`}
  >
    <source src={`/media/${src}`} type="video/webm" />
  </video>
);

const features = [
  {
    Icon: Image,
    name: "Image Generation",
    description: "Generate AI-powered images from natural language prompts.",
    href: "/",
    color: "text-pink-700",
    subColor: "text-pink-700/80",
    background: <VideoBackground src="iris-image-tool.webm" className="opacity-55 group-hover:scale-110 scale-105 transition-all ease-in-out" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Brain,
    name: "Reasoning & Planning",
    description: "Tackle complex logic problems, timelines, and structured planning.",
    href: "/",
    color: "text-red-500",
    subColor: "text-red-700/80",
    background: <VideoBackground src="iris-reasoing.webm" className="opacity-55 group-hover:scale-110 scale-105 transition-all ease-in-out" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: GlobeIcon,
    name: "Mermaid Diagrams",
    description: "Create interactive and visually appealing diagrams with AI.",
    href: "/",
    color: "text-green-700",
    subColor:"text-green-700/80",
    background: <VideoBackground src="iris-mermaid.webm" className="opacity-55 group-hover:scale-110 scale-105 transition-all ease-in-out" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: InputIcon,
    name: "Essay Writer",
    description: "Compose high-quality essays and articles with AI assistance.",
    href: "/",
    color: "text-cyan-700",
    subColor: "text-cyan-700/80",
    background: <VideoBackground src="iris-essay.webm" className="opacity-55 group-hover:scale-110 scale-105 transition-all ease-in-out" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Cloud,
    name: "Weather Insights",
    description:
      "Analyze and deliver real-time weather updates using AI tools.",
    href: "/",
    color: "text-blue-700",
    subColor: "text-blue-700/80",
    background: <VideoBackground src="iris-weather-tool.webm" className="group-hover:scale-110 scale-105 transition-all ease-in-out opacity-55" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

  
  export function HeroBentoGrid() {
    return (
      <BentoGrid className="lg:grid-rows-3 mt-12">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    );
  }
  