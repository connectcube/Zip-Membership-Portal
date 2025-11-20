import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CreditCard, Download, Info } from "lucide-react";

interface MembershipNoticeProps {
  membershipType?: string;
  specialization?: string;
  expiryDate?: string;
  onRenew?: () => void;
}

const MembershipNotice = ({
  membershipType = "Full Member",
  specialization = "Spatial Planning",
  expiryDate = "December 31, 2023",
  onRenew = () => {},
}: MembershipNoticeProps) => {
  // Calculate days until expiry
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Determine fee based on membership type
  const getMembershipFee = () => {
    switch (membershipType.toLowerCase()) {
      case "student member":
        return "K500";
      case "associate member":
        return "K1,000";
      case "full member":
        return "K1,500";
      case "fellow":
        return "K2,000";
      case "corporate member":
        return "K5,000";
      default:
        return "K1,500";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Membership Information</CardTitle>
            <CardDescription>
              Your current membership details and status
            </CardDescription>
          </div>
          {daysUntilExpiry <= 30 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Renewal Due Soon
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Membership Type</p>
            <p className="text-lg font-semibold">{membershipType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Specialization</p>
            <p className="text-lg font-semibold">{specialization}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Annual Fee</p>
            <p className="text-lg font-semibold">{getMembershipFee()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Expiry Date</p>
            <p className="text-lg font-semibold">{expiryDate}</p>
            <p className="text-sm text-gray-500">
              {daysUntilExpiry > 0
                ? `${daysUntilExpiry} days remaining`
                : "Membership expired"}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">
                Membership Categories and Fees
              </h4>
              <p className="text-sm text-blue-700 mb-2">
                The Zambia Institute of Planners offers the following membership
                categories:
              </p>
              <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                <li>
                  <span className="font-medium">
                    Student Member (K500/year):
                  </span>{" "}
                  For students enrolled in planning-related programs
                </li>
                <li>
                  <span className="font-medium">
                    Associate Member (K1,000/year):
                  </span>{" "}
                  For graduates with less than 2 years of professional
                  experience
                </li>
                <li>
                  <span className="font-medium">
                    Full Member (K1,500/year):
                  </span>{" "}
                  For qualified planners with at least 2 years of professional
                  experience
                </li>
                <li>
                  <span className="font-medium">Fellow (K2,000/year):</span> For
                  distinguished planners with significant contributions to the
                  profession
                </li>
                <li>
                  <span className="font-medium">
                    Corporate Member (K5,000/year):
                  </span>{" "}
                  For organizations involved in planning activities
                </li>
              </ul>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="h-3 w-3 mr-1" /> Download Fee Structure
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Info className="h-3 w-3 mr-1" /> Membership Benefits
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">
                Specialization Areas
              </h4>
              <p className="text-sm text-blue-700 mb-2">
                ZIP recognizes the following specialization areas for planners:
              </p>
              <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                <li>
                  <span className="font-medium">Spatial Planning:</span> Urban
                  design, land use planning, transportation planning, and
                  physical development
                </li>
                <li>
                  <span className="font-medium">Socio-economic Planning:</span>{" "}
                  Economic development, social planning, policy analysis, and
                  community development
                </li>
                <li>
                  <span className="font-medium">Environmental Planning:</span>{" "}
                  Environmental impact assessment, conservation planning, and
                  sustainable development
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Certificate
        </Button>
        <Button onClick={onRenew} className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Renew Membership
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MembershipNotice;
