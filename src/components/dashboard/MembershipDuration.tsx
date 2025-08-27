import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Award } from "lucide-react";

interface MembershipDurationProps {
  memberName?: string;
  registrationDate?: string;
  membershipType?: string;
  specialization?: string;
}

const MembershipDuration = ({
  memberName = "John Doe",
  registrationDate = "January 15, 2020",
  membershipType = "Full Member",
  specialization = "Spatial Planning",
}: MembershipDurationProps) => {
  // Calculate membership duration
  const calculateDuration = () => {
    const regDate = new Date(registrationDate);
    const today = new Date();
    
    let years = today.getFullYear() - regDate.getFullYear();
    let months = today.getMonth() - regDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months };
  };
  
  const duration = calculateDuration();
  
  // Determine member level based on years
  const getMemberLevel = () => {
    if (duration.years < 2) return "Novice";
    if (duration.years < 5) return "Established";
    if (duration.years < 10) return "Experienced";
    return "Senior";
  };
  
  const memberLevel = getMemberLevel();
  
  // Get badge color based on member level
  const getLevelBadgeColor = () => {
    switch (memberLevel) {
      case "Novice": return "secondary";
      case "Established": return "default";
      case "Experienced": return "default";
      case "Senior": return "default";
      default: return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Duration</CardTitle>
        <CardDescription>Track how long you've been a member of ZIP</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Member Since</h3>
                <p className="text-sm text-gray-500">{registrationDate}</p>
              </div>
            </div>
            <Badge variant={getLevelBadgeColor()} className="text-sm">
              {memberLevel} Member
            </Badge>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Membership Duration</h4>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">{membershipType}</span>
              </div>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="text-center px-4 border-r border-gray-300">
                <p className="text-3xl font-bold text-blue-600">{duration.years}</p>
                <p className="text-sm text-gray-500">Years</p>
              </div>
              <div className="text-center px-4">
                <p className="text-3xl font-bold text-blue-600">{duration.months}</p>
                <p className="text-sm text-gray-500">Months</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium text-sm">Registration Date</h4>
              </div>
              <p className="text-lg font-semibold">{registrationDate}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-green-600" />
                <h4 className="font-medium text-sm">Specialization</h4>
              </div>
              <p className="text-lg font-semibold">{specialization}</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>
              Your membership level is determined by your years of active membership with the Zambia Institute of Planners. Continue your professional development to maintain and advance your status.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>