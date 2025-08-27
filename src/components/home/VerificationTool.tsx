import React, { useState } from "react";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface VerificationResult {
  isValid: boolean;
  plannerName?: string;
  membershipCategory?: string;
  specialization?: string;
  expiryDate?: string;
  plannerID?: string;
  registrationDate?: string;
  town?: string;
  province?: string;
}

interface VerificationToolProps {
  onVerify?: (id: string) => Promise<VerificationResult>;
}

const VerificationTool = ({ onVerify }: VerificationToolProps = {}) => {
  const [plannerId, setPlannerId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState("");

  // Mock verification function if none is provided
  const mockVerify = async (id: string): Promise<VerificationResult> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo purposes, consider IDs starting with 'ZIP' as valid
    if (id.toUpperCase().startsWith("ZIP")) {
      return {
        isValid: true,
        plannerName: "John Mwanza",
        membershipCategory: "Full Member",
        specialization: "Spatial Planning",
        expiryDate: "31 December 2023",
        plannerID: id.toUpperCase(),
        registrationDate: "15 January 2020",
        town: "Lusaka",
        province: "Lusaka",
      };
    } else {
      return { isValid: false };
    }
  };

  const handleVerify = async () => {
    if (!plannerId.trim()) {
      setError("Please enter a Planner ID");
      return;
    }

    setError("");
    setIsVerifying(true);
    setResult(null);

    try {
      const verificationResult = await (onVerify || mockVerify)(plannerId);
      setResult(verificationResult);
    } catch (err) {
      setError("An error occurred during verification. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Planner Verification Tool
        </h2>
        <p className="text-gray-600 mt-2">
          Employers can verify the registration status of planners using their
          Planner ID number
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Enter Planner ID (e.g. ZIP12345)"
            value={plannerId}
            onChange={(e) => setPlannerId(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          onClick={handleVerify}
          disabled={isVerifying}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isVerifying ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verifying...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Verify Planner
            </span>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.isValid ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Verified Planner</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span>Unverified Planner</span>
                </>
              )}
            </CardTitle>
            <CardDescription>
              {result.isValid
                ? "This planner is registered with the Zambia Institute of Planners"
                : "No record found for the provided Planner ID"}
            </CardDescription>
          </CardHeader>
          {result.isValid && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Planner Name
                  </p>
                  <p className="text-lg font-semibold">{result.plannerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Planner ID
                  </p>
                  <p className="text-lg font-semibold">{result.plannerID}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Membership Category
                  </p>
                  <p className="text-lg font-semibold">
                    {result.membershipCategory}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Specialization
                  </p>
                  <p className="text-lg font-semibold">
                    {result.specialization}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Registration Date
                  </p>
                  <p className="text-lg font-semibold">
                    {result.registrationDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Expiry Date
                  </p>
                  <p className="text-lg font-semibold">{result.expiryDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Town</p>
                  <p className="text-lg font-semibold">{result.town}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Province</p>
                  <p className="text-lg font-semibold">{result.province}</p>
                </div>
              </div>
            </CardContent>
          )}
          <CardFooter className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setResult(null);
                setPlannerId("");
              }}
            >
              New Search
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          For any verification issues, please contact the Zambia Institute of
          Planners at support@zip.org.zm
        </p>
      </div>
    </div>
  );
};

export default VerificationTool;
