
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OnboardTrackerForm from "@/components/onboarding/OnboardTrackerForm";
import { Building, Briefcase, MapPin, User, Check, X, PhoneOutgoing, PhoneMissed } from "lucide-react";
import { OnboardStatus } from "@/types";

// Mock data for onboarding records
interface OnboardingRecord {
  id: string;
  clientName: string;
  jobTitle: string;
  candidateName: string;
  jobLocation: string;
  recruiterName: string;
  status: OnboardStatus;
  date: string;
}

const mockOnboardingRecords: OnboardingRecord[] = [
  {
    id: "1",
    clientName: "Tech Solutions Inc",
    jobTitle: "Senior React Developer",
    candidateName: "John Doe",
    jobLocation: "San Francisco, CA",
    recruiterName: "Jane Smith",
    status: "Offered",
    date: "2023-06-15"
  },
  {
    id: "2",
    clientName: "Global Finance Ltd",
    jobTitle: "Full Stack Engineer",
    candidateName: "Michael Brown",
    jobLocation: "New York, NY",
    recruiterName: "Robert Johnson",
    status: "Joined",
    date: "2023-06-10"
  },
  {
    id: "3",
    clientName: "Healthcare Systems",
    jobTitle: "Backend Developer",
    candidateName: "Emily Wilson",
    jobLocation: "Boston, MA",
    recruiterName: "Sarah Williams",
    status: "Rejected Offer",
    date: "2023-06-05"
  }
];

// Status badge component
const StatusBadge = ({ status }: { status: OnboardStatus }) => {
  const getStatusColor = (status: OnboardStatus) => {
    switch (status) {
      case "Joined":
        return "bg-green-100 text-green-800 border-green-200";
      case "Offered":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Not PickedUp":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Rejected Offer":
      case "Rejected First Round":
      case "Rejected Second Round":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: OnboardStatus) => {
    switch (status) {
      case "Joined":
        return <Check className="mr-1 h-3 w-3" />;
      case "Offered":
        return <PhoneOutgoing className="mr-1 h-3 w-3" />;
      case "Not PickedUp":
        return <PhoneMissed className="mr-1 h-3 w-3" />;
      case "Rejected Offer":
      case "Rejected First Round":
      case "Rejected Second Round":
        return <X className="mr-1 h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Badge className={`flex items-center ${getStatusColor(status)}`} variant="outline">
      {getStatusIcon(status)}
      {status}
    </Badge>
  );
};

const OnboardTrackerPage = () => {
  const [records, setRecords] = useState<OnboardingRecord[]>(mockOnboardingRecords);

  const handleFormSubmit = (data: any) => {
    const newRecord: OnboardingRecord = {
      id: `${records.length + 1}`,
      ...data,
      date: new Date().toISOString().slice(0, 10),
    };
    setRecords([newRecord, ...records]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Onboard Tracker</h1>
        <OnboardTrackerForm onSubmit={handleFormSubmit} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {records.map((record) => (
          <Card key={record.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5 text-muted-foreground" />
                    {record.clientName}
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center">
                    <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                    {record.jobTitle}
                  </CardDescription>
                </div>
                <StatusBadge status={record.status} />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Candidate</div>
                    <div className="font-medium">{record.candidateName}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Location</div>
                    <div className="font-medium">{record.jobLocation}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Recruiter</div>
                    <div className="font-medium">{record.recruiterName}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OnboardTrackerPage;
