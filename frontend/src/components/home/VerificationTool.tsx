import React, { useState } from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export interface VerificationResult {
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

// amazonq-ignore-next-line
const VerificationTool = ({ onVerify }: VerificationToolProps = {}) => {
  const [plannerId, setPlannerId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState('');

  const mockVerify = async (id: string): Promise<VerificationResult> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (id.toUpperCase().startsWith('ZIP')) {
      return {
        isValid: true,
        plannerName: 'John Mwanza',
        membershipCategory: 'Full Member',
        specialization: 'Spatial Planning',
        expiryDate: '31 December 2023',
        plannerID: id.toUpperCase(),
        registrationDate: '15 January 2020',
        town: 'Lusaka',
        province: 'Lusaka',
      };
    } else {
      return { isValid: false };
    }
  };

  const handleVerify = async () => {
    if (!plannerId.trim()) {
      setError('Please enter a Planner ID');
      return;
    }

    setError('');
    setIsVerifying(true);
    setResult(null);

    try {
      const verificationResult = await (onVerify || mockVerify)(plannerId);
      setResult(verificationResult);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An error occurred during verification. Please try again.';
      setError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white shadow-md mx-auto p-6 rounded-xl w-full max-w-4xl">
      <div className="mb-6 text-center">
        <h2 className="font-bold text-gray-800 text-3xl">Planner Verification Tool</h2>
        <p className="mt-2 text-gray-600">
          Employers can verify the registration status of planners using their Planner ID number
        </p>
      </div>

      <div className="flex md:flex-row flex-col gap-4 mb-6">
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Enter Planner ID (e.g. ZIP12345)"
            value={plannerId}
            onChange={e => setPlannerId(e.target.value)}
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
              <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></div>
              Verifying...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4" />
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
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Verified Planner</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span>Unverified Planner</span>
                </>
              )}
            </CardTitle>
            <CardDescription>
              {result.isValid
                ? 'This planner is registered with the Zambia Institute of Planners'
                : 'No record found for the provided Planner ID'}
            </CardDescription>
          </CardHeader>
          {result.isValid && (
            <CardContent>
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                {[
                  { label: 'Planner Name', value: result.plannerName },
                  { label: 'Planner ID', value: result.plannerID },
                  { label: 'Membership Category', value: result.membershipCategory },
                  { label: 'Specialization', value: result.specialization },
                  { label: 'Registration Date', value: result.registrationDate },
                  { label: 'Expiry Date', value: result.expiryDate },
                  { label: 'Town', value: result.town },
                  { label: 'Province', value: result.province },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-medium text-gray-500 text-sm">{label}</p>
                    <p className="font-semibold text-lg">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
          <CardFooter className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setResult(null);
                setPlannerId('');
              }}
            >
              New Search
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="mt-6 text-gray-500 text-sm text-center">
        <p>
          For any verification issues, please contact the Zambia Institute of Planners at
          support@zip.org.zm
        </p>
      </div>
    </div>
  );
};

export default VerificationTool;
