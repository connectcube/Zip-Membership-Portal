import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Users,
  CreditCard,
  Bell,
  Shield,
  FileText,
} from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({
  icon = <CheckCircle className="h-10 w-10 text-primary" />,
  title = "Feature Title",
  description = "Feature description goes here.",
}: FeatureProps) => {
  return (
    <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-primary rounded-lg overflow-hidden">
      <CardContent className="p-8 flex flex-col items-center text-center">
        <div className="mb-5 text-primary">{icon}</div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

interface FeatureHighlightsProps {
  features?: FeatureProps[];
  title?: string;
  subtitle?: string;
}

const FeatureHighlights = ({
  features = [
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Member Management",
      description:
        "Streamlined registration and profile management for all planning professionals.",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Secure Payments",
      description:
        "Integrated payment system for membership fees with multiple payment options.",
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Credential Verification",
      description:
        "Easy verification tool for employers to validate planners' credentials.",
    },
    {
      icon: <Bell className="h-10 w-10 text-primary" />,
      title: "Notifications",
      description:
        "Stay updated with important announcements and membership status changes.",
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Document Access",
      description:
        "Central repository for important planning documents and resources.",
    },
  ],
  title = "Key Features",
  subtitle = "Discover the benefits of our comprehensive membership portal",
}: FeatureHighlightsProps) => {
  return (
    <section className="w-full py-20 px-4 bg-slate-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-3">{title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
