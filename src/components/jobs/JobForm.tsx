import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, X, Briefcase, BuildingIcon, MapPin, Clock, CalendarClock, DollarSign, GraduationCap, Award, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createJob } from "@/services/api";
import { JobDescription } from "@/types"; // Added import for JobDescription type

// Validation schema for job form
const jobFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobReferenceNumber: z.string().min(1, "Job reference number is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  roleCategory: z.string().min(1, "Role category is required"),
  experience: z.coerce.number().min(0, "Experience must be a positive number"),
  jobDescription: z.string().min(1, "Job description is required"),
  location: z.string().min(1, "Location is required"),
  noOfPositions: z.coerce.number().min(1, "Number of positions must be at least 1"),
  workType: z.enum(["Onsite", "Offshore", "Hybrid"]),
  employmentType: z.enum(["Contract", "Permanent"]),
  responsiblePerson: z.string().min(1, "Responsible person is required"),
  timing: z.string().min(1, "Timing is required"),
  noticePeriod: z.string().min(1, "Notice period is required"),
  package: z.string().min(1, "Package is required"),
  budget: z.coerce.number().min(0, "Budget must be a positive number"),
  educationMaster: z.string().optional(),
  educationBachelor: z.string().min(1, "Bachelor's degree is required"),
  remarks: z.string().optional(),
  anyCertification: z.string().optional(),
  primarySkills: z.array(z.string()).min(1, "At least one primary skill is required"),
  secondarySkills: z.array(z.string()).optional(),
  frontEndSkills: z.array(z.string()).optional(),
  backEndSkills: z.array(z.string()).optional(),
  dbSkills: z.array(z.string()).optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const JobForm = ({ isOpen, onClose }: JobFormProps) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for dynamic skill fields
  const [primarySkills, setPrimarySkills] = useState<string[]>([""]);
  const [secondarySkills, setSecondarySkills] = useState<string[]>([""]);
  const [frontEndSkills, setFrontEndSkills] = useState<string[]>([""]);
  const [backEndSkills, setBackEndSkills] = useState<string[]>([""]);
  const [dbSkills, setDbSkills] = useState<string[]>([""]);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      companyName: "",
      jobReferenceNumber: "",
      jobTitle: "",
      roleCategory: "",
      experience: 0,
      jobDescription: "",
      location: "",
      noOfPositions: 1,
      workType: "Onsite",
      employmentType: "Permanent",
      responsiblePerson: "",
      timing: "",
      noticePeriod: "",
      package: "",
      budget: 0,
      educationMaster: "",
      educationBachelor: "",
      remarks: "",
      anyCertification: "",
      primarySkills: [""],
      secondarySkills: [""],
      frontEndSkills: [""],
      backEndSkills: [""],
      dbSkills: [""],
    },
  });

  // Helper function to add skill field
  const addSkillField = (setSkills: React.Dispatch<React.SetStateAction<string[]>>) => {
    setSkills(prev => [...prev, ""]);
  };

  // Helper function to remove skill field
  const removeSkillField = (index: number, setSkills: React.Dispatch<React.SetStateAction<string[]>>) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  // Helper function to update skill field
  const updateSkillField = (
    index: number,
    value: string,
    setSkills: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSkills(prev => prev.map((skill, i) => (i === index ? value : skill)));
  };

  const onSubmit = async (data: JobFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Filter out empty skills
      data.primarySkills = primarySkills.filter(skill => skill.trim() !== "");
      data.secondarySkills = secondarySkills.filter(skill => skill.trim() !== "");
      data.frontEndSkills = frontEndSkills.filter(skill => skill.trim() !== "");
      data.backEndSkills = backEndSkills.filter(skill => skill.trim() !== "");
      data.dbSkills = dbSkills.filter(skill => skill.trim() !== "");
      
      // Make sure all required fields are present
      const jobData: Omit<JobDescription, 'id' | 'clientId'> = {
        companyName: data.companyName,
        jobReferenceNumber: data.jobReferenceNumber,
        jobTitle: data.jobTitle,
        roleCategory: data.roleCategory,
        experience: data.experience,
        jobDescription: data.jobDescription,
        location: data.location,
        noOfPositions: data.noOfPositions,
        workType: data.workType,
        employmentType: data.employmentType,
        responsiblePerson: data.responsiblePerson,
        timing: data.timing,
        noticePeriod: data.noticePeriod,
        package: data.package,
        budget: data.budget,
        educationMaster: data.educationMaster || "",
        educationBachelor: data.educationBachelor,
        remarks: data.remarks || "",
        anyCertification: data.anyCertification || "",
        primarySkills: data.primarySkills,
        secondarySkills: data.secondarySkills || [],
        frontEndSkills: data.frontEndSkills || [],
        backEndSkills: data.backEndSkills || [],
        dbSkills: data.dbSkills || []
      };
      
      // Call API to create job
      await createJob(jobData);
      
      // Show success message
      toast.success("Job description created successfully");
      
      // Invalidate jobs query to refresh list
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      
      // Close form dialog
      onClose();
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Failed to create job description");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            New Job Description
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new job description.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <BuildingIcon className="h-5 w-5 text-blue-600" />
                Company Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobReferenceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Reference Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. JOB-2025-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsiblePerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsible Person*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter responsible person" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <Briefcase className="h-5 w-5 text-purple-600" />
                Job Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roleCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Category*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Engineering, Management" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience (Years)*</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location*
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter job location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="noOfPositions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Positions*</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Type*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select work type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Onsite">Onsite</SelectItem>
                          <SelectItem value="Offshore">Offshore</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Permanent">Permanent</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter detailed job description"
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Compensation & Timing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Compensation & Timing
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="timing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4" />
                        Timing*
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Full-time, 9AM-5PM" {...field} />
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
                        <Input placeholder="e.g. 30 days" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="package"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. $80,000 - $100,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget*</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1000" placeholder="Enter budget" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Education & Certification */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <GraduationCap className="h-5 w-5 text-indigo-600" />
                Education & Certification
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="educationBachelor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bachelor's Degree*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Computer Science, Engineering" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="educationMaster"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Master's Degree</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. MBA, MS in Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="anyCertification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Certification
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. AWS, PMP, CISSP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional information or requirements"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <CheckCircle2 className="h-5 w-5 text-orange-600" />
                Skills
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Primary Skills *
                  </label>
                  {primarySkills.map((skill, index) => (
                    <div key={`primary-${index}`} className="flex items-center gap-2 mb-2">
                      <Input
                        value={skill}
                        onChange={(e) => updateSkillField(index, e.target.value, setPrimarySkills)}
                        placeholder="Enter primary skill"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (primarySkills.length > 1) {
                            removeSkillField(index, setPrimarySkills);
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addSkillField(setPrimarySkills)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Primary Skill
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Secondary Skills</label>
                    {secondarySkills.map((skill, index) => (
                      <div key={`secondary-${index}`} className="flex items-center gap-2 mb-2">
                        <Input
                          value={skill}
                          onChange={(e) => updateSkillField(index, e.target.value, setSecondarySkills)}
                          placeholder="Enter secondary skill"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (secondarySkills.length > 1) {
                              removeSkillField(index, setSecondarySkills);
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSkillField(setSecondarySkills)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Secondary Skill
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Front End Skills</label>
                    {frontEndSkills.map((skill, index) => (
                      <div key={`frontend-${index}`} className="flex items-center gap-2 mb-2">
                        <Input
                          value={skill}
                          onChange={(e) => updateSkillField(index, e.target.value, setFrontEndSkills)}
                          placeholder="Enter front-end skill"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (frontEndSkills.length > 1) {
                              removeSkillField(index, setFrontEndSkills);
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSkillField(setFrontEndSkills)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Front End Skill
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Back End Skills</label>
                    {backEndSkills.map((skill, index) => (
                      <div key={`backend-${index}`} className="flex items-center gap-2 mb-2">
                        <Input
                          value={skill}
                          onChange={(e) => updateSkillField(index, e.target.value, setBackEndSkills)}
                          placeholder="Enter back-end skill"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (backEndSkills.length > 1) {
                              removeSkillField(index, setBackEndSkills);
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSkillField(setBackEndSkills)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Back End Skill
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Database Skills</label>
                    {dbSkills.map((skill, index) => (
                      <div key={`db-${index}`} className="flex items-center gap-2 mb-2">
                        <Input
                          value={skill}
                          onChange={(e) => updateSkillField(index, e.target.value, setDbSkills)}
                          placeholder="Enter database skill"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (dbSkills.length > 1) {
                              removeSkillField(index, setDbSkills);
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSkillField(setDbSkills)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Database Skill
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Job Description"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JobForm;
