

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Candidate, CandidateStatus } from "@/types";
import { X, Plus, Upload, User, Building, Briefcase, MapPin, Mail, Phone, Award, DollarSign, Contact } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; 
import {addCandidate,getAllCandidates,updateCandidate} from '../../client/Api/FormApi';

const candidateStatuses: CandidateStatus[] = [
  "Excellent",
  "Ok to Proceed",
  "Average",
  "Rejected",
  "Hold",
  "Not Interested",
  "Yet to Call",
  "Pending",
  "Not Picked",
  "Asked to Call Later",
  "Dropped"
];

const candidateSchema = z.object({
  candidateName: z.string().min(2, { message: "Candidate name is required" }),
  clientName: z.string().min(2, { message: "Client name is required" }),
  overallExperience: z.number().min(0, { message: "Overall experience is required" }),
  relevantExp: z.number().min(0, { message: "Relevant experience is required" }),
  currentLocation: z.string().min(1, { message: "Current location is required" }),
  candidatePreferredLocation: z.boolean().default(false),
  qualification: z.string().min(1, { message: "Qualification is required" }),
  noticePeriod: z.string().min(1, { message: "Notice period is required" }),
  currentlyServingNotice: z.boolean().default(false),
  currentlyHoldingOffer: z.boolean().default(false),
  currentOfferValue: z.string().optional(),
  expCTC: z.number().min(0, { message: "Expected CTC is required" }),
  currentCTC: z.number().min(0, { message: "Current CTC is required" }),
  status: z.enum(candidateStatuses as [CandidateStatus, ...CandidateStatus[]]),
  mobileNo: z.string().min(10, { message: "Valid mobile number is required" }),
  whatsAppNo: z.string().optional(),
  emailId: z.string().email({ message: "Valid email is required" }),
  shortlistedBy: z.string().min(1, { message: "Shortlisted by is required" }),
  remarks: z.string().optional(),
  primarySkills: z.array(z.string()).min(1, { message: "At least one primary skill is required" }),
  secondarySkills: z.array(z.string()).optional(),
});

interface CandidateFormProps {
  initialData?: Partial<Candidate>;
  onCancel: () => void;
  onSubmit: (candidateData: z.infer<typeof candidateSchema>) => Promise<void>;
  isSubmitting: boolean;
}

const CandidateForm = ({
  initialData = {},
  onCancel,
  onSubmit,
  
}: CandidateFormProps) => {
  const [primarySkills, setPrimarySkills] = useState<string[]>(initialData.primarySkills || []);
  const [secondarySkills, setSecondarySkills] = useState<string[]>(initialData.secondarySkills || []);
  const [newPrimarySkill, setNewPrimarySkill] = useState("");
  const [newSecondarySkill, setNewSecondarySkill] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof candidateSchema>>({
    resolver: zodResolver(candidateSchema),
   defaultValues: {
  candidateName: initialData.candidateName || "",
  clientName: initialData.clientName || "",
  overallExperience: initialData.overallExperience || 0,
  relevantExperience: initialData.relevantExperience || 0,
  currentLocation: initialData.currentLocation || "",
  preferredLocation: initialData.preferredLocation || false, // boolean or location string depending on usage
  qualification: initialData.qualification || "",
  noticePeriod: initialData.noticePeriod || "",
  currentlyServingNotice: initialData.currentlyServingNotice || false,
  currentlyHoldingOffer: initialData.currentlyHoldingOffer || false,
  currentOfferValue: initialData.currentOfferValue || "",
  expectedCTC: initialData.expectedCTC || 0,
  currentCTC: initialData.currentCTC || 0,
  status: initialData.candidateStatus || "Yet to Call", // Or true/false based on your API
  mobileNumber: initialData.mobileNumber || "",
  whatsAppNumber: initialData.whatsAppNumber || "",
  emailAddress: initialData.emailAddress || "",
  shortlistedBy: initialData.shortlistedBy || "",
  additionalRemarks: initialData.additionalRemarks || "",
  primarySkills: initialData.primarySkills || [],
  secondarySkills: initialData.secondarySkills || [],
}

  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      // Check if file is a PDF or document
      if (file.type === "application/pdf" || 
          file.type === "application/msword" || 
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setResumeFile(file);
        toast({
          title: "Resume uploaded",
          description: `File "${file.name}" selected successfully.`,
        });
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF or Word document.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof candidateSchema>) => {
  setIsSubmitting(true);
  
  try {
    const formData = new FormData();
    
    // Map form fields to API expected fields
  formData.append('candidateName', data.candidateName);
formData.append('emailAddress', data.emailId);
formData.append('currentLocation', data.currentLocation);
formData.append('qualification', data.qualification);
formData.append('preferredLocation', data.candidatePreferredLocation ? data.currentLocation : '');
formData.append('mobileNumber', data.mobileNo);
formData.append('whatsAppNumber', data.whatsAppNo || data.mobileNo);
formData.append('clientName', data.clientName || '');
formData.append('overallExperience', data.overallExperience?.toString() || '0');
formData.append('relevantExperience', data.relevantExp?.toString() || '0');
formData.append('shortlistedBy', data.shortlistedBy || '');
formData.append('noticePeriod', data.noticePeriod || '');
formData.append('currentlyServingNotice', data.currentlyServingNotice.toString());
formData.append('currentlyHoldingOffer', data.currentlyHoldingOffer.toString());
formData.append('currentOfferValue', data.currentOfferValue || '0');
formData.append('currentCTC', data.currentCTC?.toString() || '0');
formData.append('expectedCTC', data.expCTC?.toString() || '0');
formData.append('primarySkills', data.primarySkills.length > 0 ? data.primarySkills.join(', ') : '');
formData.append('secondarySkills', data.secondarySkills?.join(', ') || '');
formData.append('additionalRemarks', data.remarks || '');
formData.append('candidateStatus', data.status); 
    
    // Append resume file if exists
    if (resumeFile) {
      formData.append('resumeUpload', resumeFile);
    }

    // Use either Redux action or direct API call, not both
    const response = await addCandidate(formData);

    if (response.status === 200 || response.status === 201) {
      toast({
        title: "Success",
        description: "Candidate added successfully!",
        variant: "default",
      });
      onCancel();
    }
  } catch (error) {
    console.error("Submission error:", error);
    toast({
      title: "Error",
      description: error.response?.data?.message || 
                  error.message || 
                  "Failed to submit form. Check console for details.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  const addPrimarySkill = () => {
    if (newPrimarySkill && !primarySkills.includes(newPrimarySkill)) {
      const updatedSkills = [...primarySkills, newPrimarySkill];
      setPrimarySkills(updatedSkills);
      form.setValue("primarySkills", updatedSkills);
      setNewPrimarySkill("");
    }
  };

  const removePrimarySkill = (skill: string) => {
    const updatedSkills = primarySkills.filter(s => s !== skill);
    setPrimarySkills(updatedSkills);
    form.setValue("primarySkills", updatedSkills);
  };

  const addSecondarySkill = () => {
    if (newSecondarySkill && !secondarySkills.includes(newSecondarySkill)) {
      const updatedSkills = [...secondarySkills, newSecondarySkill];
      setSecondarySkills(updatedSkills);
      form.setValue("secondarySkills", updatedSkills);
      setNewSecondarySkill("");
    }
  };

  const removeSecondarySkill = (skill: string) => {
    const updatedSkills = secondarySkills.filter(s => s !== skill);
    setSecondarySkills(updatedSkills);
    form.setValue("secondarySkills", updatedSkills);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto px-1">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Personal Information Section */}
          <div>
            <div className="flex items-center mb-2 pb-2 border-b">
              <User className="mr-3 h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              <FormField
                control={form.control}
                name="candidateName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., B.Tech, MCA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Location*</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="candidatePreferredLocation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Preferred Location?</FormLabel>
                      <FormDescription className="text-xs">
                        Is current location preferred?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Contact Details Section */}

          <div className="!mt-0">  {/* Force zero top margin */}
            <div className="flex items-center border-b pt-0 mt-3 pb-1">  {/* Explicit padding control */}
              <Contact className="mr-3 h-5 w-5 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 !mt-1">             
              <FormField
                control={form.control}
                name="emailId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobileNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsAppNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Number</FormLabel>
                    <FormControl>
                      <Input placeholder="WhatsApp (if different)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Professional Details Section */}
          <div className="!mt-0">
            <div className="flex items-center border-b pt-0 mt-3 pb-1">
              <Briefcase className="mr-3 h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-900">Professional Details</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 !mt-1">               
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="overallExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall Experience (years)*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relevantExp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relevant Experience (years)*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {candidateStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortlistedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shortlisted By*</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of person" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="noticePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice Period*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 30 days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentlyServingNotice"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Currently Serving Notice?</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentlyHoldingOffer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Currently Holding Offer?</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("currentlyHoldingOffer") && (
                <FormField
                  control={form.control}
                  name="currentOfferValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Offer Value</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 120000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          {/* Compensation Section */}
          <div className="!mt-0">
            <div className="flex items-center pt-0 mt-3 pb-1 border-b">
              <DollarSign className="mr-3 h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-semibold text-gray-900">Compensation</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 !mt-1">
              <FormField
                control={form.control}
                name="currentCTC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current CTC*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Current salary"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expCTC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected CTC*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Expected salary"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Resume Upload Section */}
          <div className="!mt-0">
            <div className="flex items-center pt-0 mt-3 pb-1 border-b">
              <Upload className="mr-3 h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">Resume Upload</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 !mt-1 ">
              <div>
                <FormLabel>Resume Upload</FormLabel>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Resume
                  </Button>
                  {resumeFile && (
                    <div className="text-sm bg-muted px-3 py-1 rounded-full">
                      {resumeFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="!mt-0">
            <div className="flex items-center border-b pt-0 mt-3 pb-1">
              <Award className="mr-3 h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 !mt-1">
              <FormField
                control={form.control}
                name="primarySkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Skills*</FormLabel>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add primary skill"
                          value={newPrimarySkill}
                          onChange={(e) => setNewPrimarySkill(e.target.value)}
                        />
                        <Button type="button" onClick={addPrimarySkill}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {primarySkills.map(skill => (
                          <div key={skill} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {skill}
                            <Button
                              type="button"
                              variant="ghost"
                              className="h-6 w-6 p-0 ml-1 text-blue-600 hover:text-blue-800"
                              onClick={() => removePrimarySkill(skill)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondarySkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Skills</FormLabel>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add secondary skill"
                          value={newSecondarySkill}
                          onChange={(e) => setNewSecondarySkill(e.target.value)}
                        />
                        <Button type="button" onClick={addSecondarySkill}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {secondarySkills.map(skill => (
                          <div key={skill} className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {skill}
                            <Button
                              type="button"
                              variant="ghost"
                              className="h-6 w-6 p-0 ml-1 text-gray-500 hover:text-gray-700"
                              onClick={() => removeSecondarySkill(skill)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="!mt-0">
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Remarks</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about the candidate" 
                      {...field} 
                      className="resize-none h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t sticky bottom-0 bg-white">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : "Save Candidate"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CandidateForm;