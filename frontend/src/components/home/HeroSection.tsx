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
  title = "Welcome to Zambia Institute of Planners- Membership Portal",
  subtitle = "A comprehensive membership portal for professional planners in Zambia. Register, manage your profile, and stay updated with the latest industry news and events.",
  ctaText = "Register Now",
  secondaryCtaText = "Member Login",
  onCtaClick = () => {},
  onSecondaryCtaClick = () => {},
  backgroundImage = "/heroImg.jpg",
}: HeroSectionProps) => {
  return (
    <div className="relative bg-gray-900 w-full h-[600px] overflow-hidden text-white">
      {/* Background Image with Overlay */}
      <div
        className="z-0 absolute inset-0 bg-start bg-cover"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content Container */}
      <div className="z-10 relative flex flex-col justify-center items-start mx-auto px-4 max-w-4xl h-full container">
        <h1 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl text-pretty leading-tight">
          {title}
        </h1>

        <p className="mb-10 max-w-2xl text-gray-200 text-lg md:text-xl">
          {subtitle}
        </p>

        <div className="flex sm:flex-row flex-col gap-5">
          <Button
            size="lg"
            onClick={onCtaClick}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-md font-semibold text-white hover:scale-105 transition-all duration-300 transform"
          >
            {ctaText}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onSecondaryCtaClick}
            className="bg-transparent hover:bg-white shadow-lg border-2 border-white font-semibold text-white hover:text-gray-900 transition-all duration-300"
          >
            {secondaryCtaText}
          </Button>
        </div>

        <div className="flex items-center mt-16">
          <div className="bg-blue-500 mr-4 w-20 h-1"></div>
          <p className="text-gray-300 text-sm">
            Empowering Planning Professionals Since 1988
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
