import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  onCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
  backgroundImage?: string;
}

const HeroSection = ({
  title = "Welcome to Zambia Institute of Planners",
  subtitle = "A comprehensive membership portal for professional planners in Zambia. Register, manage your profile, and stay updated with the latest industry news and events.",
  ctaText = "Register Now",
  secondaryCtaText = "Member Login",
  onCtaClick = () => {},
  onSecondaryCtaClick = () => {},
  backgroundImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
}: HeroSectionProps) => {
  return (
    <div className="relative w-full h-[600px] bg-gray-900 text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          {title}
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-5">
          <Button
            size="lg"
            onClick={onCtaClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-md transition-all duration-300 transform hover:scale-105"
          >
            {ctaText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onSecondaryCtaClick}
            className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-gray-900 font-semibold transition-all duration-300 shadow-lg"
          >
            {secondaryCtaText}
          </Button>
        </div>

        <div className="mt-16 flex items-center">
          <div className="h-1 w-20 bg-emerald-500 mr-4"></div>
          <p className="text-sm text-gray-300">
            Empowering Planning Professionals Since 1988
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
