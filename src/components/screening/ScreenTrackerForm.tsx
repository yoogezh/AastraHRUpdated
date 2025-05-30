
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, User, Briefcase, Phone, Mail, MapPin, Clock, DollarSign, FileText, Users } from "lucide-react";

interface ScreenTrackerFormData {
  role: string;
  name: string;
  phoneNo: string;
  email: string;
  updatedResume: File | null;
  currentLocation: string;
  overallExp: string;
  relevantExp: string;
  noticePeriod: string;
  reasonForBreak: string;
  currentCTC: string;
  expectedCTC: string;
  interviewTimeSlot: string;
  onboardingStatus: string;
  hrName: string;
  remarks: string;
  status: string;
}

const statusOptions = [
  "Excellent",
  "Ok to Proceed",
  "Average",
  "Below Average",
  "Rejected",
  "Hold",
  "Not Interested",
  "Yet to Call",
  "Pending",
  "Not Picked",
  "Asked to Call Later",
  "Dropped"
];

interface ScreenTrackerFormProps {
  onSubmit: (data: ScreenTrackerFormData) => void;
}

const ScreenTrackerForm: React.FC<ScreenTrackerFormProps> = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ScreenTrackerFormData>({
    role: "",
    name: "",
    phoneNo: "",
    email: "",
    updatedResume: null,
    currentLocation: "",
    overallExp: "",
    relevantExp: "",
    noticePeriod: "",
    reasonForBreak: "",
    currentCTC: "",
    expectedCTC: "",
    interviewTimeSlot: "",
    onboardingStatus: "",
    hrName: "",
    remarks: "",
    status: ""
  });

  const handleInputChange = (field: keyof ScreenTrackerFormData, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange("updatedResume", file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    handleReset();
    setIsOpen(false);
  };

  const handleReset = () => {
    setFormData({
      role: "",
      name: "",
      phoneNo: "",
      email: "",
      updatedResume: null,
      currentLocation: "",
      overallExp: "",
      relevantExp: "",
      noticePeriod: "",
      reasonForBreak: "",
      currentCTC: "",
      expectedCTC: "",
      interviewTimeSlot: "",
      onboardingStatus: "",
      hrName: "",
      remarks: "",
      status: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Screen Tracker
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Add Screen Tracker</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <User className="mr-2 h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    placeholder="Enter role"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNo">Phone No</Label>
                  <Input
                    id="phoneNo"
                    type="tel"
                    value={formData.phoneNo}
                    onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experience & Location Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Briefcase className="mr-2 h-5 w-5" />
                Experience & Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentLocation">Current Location</Label>
                  <Input
                    id="currentLocation"
                    type="text"
                    value={formData.currentLocation}
                    onChange={(e) => handleInputChange("currentLocation", e.target.value)}
                    placeholder="Enter current location"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="overallExp">Overall Experience</Label>
                  <Input
                    id="overallExp"
                    type="text"
                    value={formData.overallExp}
                    onChange={(e) => handleInputChange("overallExp", e.target.value)}
                    placeholder="e.g., 5 years"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="relevantExp">Relevant Experience</Label>
                  <Input
                    id="relevantExp"
                    type="text"
                    value={formData.relevantExp}
                    onChange={(e) => handleInputChange("relevantExp", e.target.value)}
                    placeholder="e.g., 3 years"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial & Schedule Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <DollarSign className="mr-2 h-5 w-5" />
                Financial & Schedule Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentCTC">Current CTC</Label>
                  <Input
                    id="currentCTC"
                    type="text"
                    value={formData.currentCTC}
                    onChange={(e) => handleInputChange("currentCTC", e.target.value)}
                    placeholder="Enter current CTC"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expectedCTC">Expected CTC</Label>
                  <Input
                    id="expectedCTC"
                    type="text"
                    value={formData.expectedCTC}
                    onChange={(e) => handleInputChange("expectedCTC", e.target.value)}
                    placeholder="Enter expected CTC"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interviewTimeSlot">Interview Time Slot</Label>
                  <Input
                    id="interviewTimeSlot"
                    type="text"
                    value={formData.interviewTimeSlot}
                    onChange={(e) => handleInputChange("interviewTimeSlot", e.target.value)}
                    placeholder="e.g., 10:00 AM - 11:00 AM"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="onboardingStatus">Onboarding Status</Label>
                  <Input
                    id="onboardingStatus"
                    type="text"
                    value={formData.onboardingStatus}
                    onChange={(e) => handleInputChange("onboardingStatus", e.target.value)}
                    placeholder="Enter onboarding status"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 h-5 w-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hrName">HR Name</Label>
                  <Input
                    id="hrName"
                    type="text"
                    value={formData.hrName}
                    onChange={(e) => handleInputChange("hrName", e.target.value)}
                    placeholder="Enter HR name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="updatedResume">Upload Resume</Label>
                  <Input
                    id="updatedResume"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="noticePeriod">Notice Period</Label>
                  <Input
                    id="noticePeriod"
                    type="text"
                    value={formData.noticePeriod}
                    onChange={(e) => handleInputChange("noticePeriod", e.target.value)}
                    placeholder="e.g., 30 days, Immediate"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="reasonForBreak">Reason For Break</Label>
                  <Textarea
                    id="reasonForBreak"
                    value={formData.reasonForBreak}
                    onChange={(e) => handleInputChange("reasonForBreak", e.target.value)}
                    placeholder="Enter reason for career break (if any)"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={formData.remarks}
                    onChange={(e) => handleInputChange("remarks", e.target.value)}
                    placeholder="Enter additional remarks"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-center space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScreenTrackerForm;
