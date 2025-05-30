import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import ScreenTrackerForm from "@/components/screening/ScreenTrackerForm";

interface ScreeningItem {
  id: string;
  candidateName: string;
  position: string;
  status: string;
  scheduledDate: string;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low';
}

const mockData: ScreeningItem[] = [
  {
    id: "SCR7835",
    candidateName: "John Smith",
    position: "Frontend Developer",
    status: "Scheduled",
    scheduledDate: "29-03-2025",
    assignedTo: "Alice Johnson",
    priority: "High"
  },
  {
    id: "SCR7836",
    candidateName: "Emma Davis",
    position: "React Developer",
    status: "Completed",
    scheduledDate: "28-03-2025",
    assignedTo: "Bob Williams",
    priority: "Medium"
  },
  {
    id: "SCR7837",
    candidateName: "Michael Brown",
    position: "Full Stack Developer",
    status: "Pending",
    scheduledDate: "30-03-2025",
    assignedTo: "Carol Martinez",
    priority: "High"
  },
  {
    id: "SCR7838",
    candidateName: "Sarah Wilson",
    position: "UX Designer",
    status: "Cancelled",
    scheduledDate: "01-04-2025",
    assignedTo: "David Lee",
    priority: "Low"
  },
  {
    id: "SCR7839",
    candidateName: "James Taylor",
    position: "Backend Developer",
    status: "Scheduled",
    scheduledDate: "02-04-2025",
    assignedTo: "Emily Garcia",
    priority: "Medium"
  }
];

const ScreenTrackerPage = () => {
  const [screeningData] = useState<ScreeningItem[]>(mockData);
  const [selectedScreening, setSelectedScreening] = useState<ScreeningItem | null>(mockData[0]);

  const handleScreeningSelect = (screening: ScreeningItem) => {
    setSelectedScreening(screening);
  };

  const handleFormSubmit = (data: any) => {
    console.log("Screen tracker form submitted:", data);
    // Here you would typically send the data to your backend
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Scheduled</Badge>;
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'Pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>;
      case 'Medium':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Review Screening Details</h1>
            <p className="text-muted-foreground">Screening Tracker</p>
          </div>
        </div>
        <ScreenTrackerForm onSubmit={handleFormSubmit} />
      </div>
      
      {selectedScreening && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-full bg-aastra-blue flex items-center justify-center text-white">
                  <span className="font-semibold">AS</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Aastra HR Solutions</h3>
                  <div className="text-sm text-muted-foreground">
                    <div>Phone: 9876543210</div>
                    <div>Email: hr@aastrasolutions.com</div>
                    <div>ID: AAHRA123456</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Screening Summary</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Position:</span>
                    <span className="col-span-2 font-medium">{selectedScreening.position}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Assigned To:</span>
                    <span className="col-span-2 font-medium">{selectedScreening.assignedTo}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="col-span-2 font-medium">Virtual / Zoom</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6 flex items-center justify-between">
                <h3 className="text-lg font-medium">Screening Details</h3>
                <div className="flex space-x-2">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Screening ID</div>
                    <div className="font-medium">{selectedScreening.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Scheduled Date</div>
                    <div className="font-medium">{selectedScreening.scheduledDate}</div>
                  </div>
                </div>
              </div>
              
              <div className="border-t">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned To</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {screeningData.map((screening) => (
                      <TableRow 
                        key={screening.id} 
                        className={`cursor-pointer ${selectedScreening.id === screening.id ? 'bg-muted/50' : ''}`}
                        onClick={() => handleScreeningSelect(screening)}
                      >
                        <TableCell className="font-medium">{screening.candidateName}</TableCell>
                        <TableCell>{screening.position}</TableCell>
                        <TableCell>{getStatusBadge(screening.status)}</TableCell>
                        <TableCell>{getPriorityBadge(screening.priority)}</TableCell>
                        <TableCell>{screening.assignedTo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="p-6 border-t">
                <h4 className="font-medium mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground">
                  Schedule follow-up with candidate regarding technical assessment results.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenTrackerPage;
