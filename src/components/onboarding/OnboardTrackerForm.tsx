
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OnboardStatus } from "@/types";
import { User, Building, Briefcase, MapPin, Check, X, PhoneMissed, PhoneOutgoing } from "lucide-react";

// Form schema for validation
const formSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  candidateName: z.string().min(1, "Candidate name is required"),
  jobLocation: z.string().min(1, "Job location is required"),
  recruiterName: z.string().min(1, "Recruiter name is required"),
  status: z.enum(["Offered", "Joined", "Rejected Offer", "Not PickedUp", "Rejected Second Round", "Rejected First Round"]),
});

type FormValues = z.infer<typeof formSchema>;

// Status icon mapping
const getStatusIcon = (status: OnboardStatus) => {
  switch (status) {
    case "Joined":
      return <Check className="mr-2 h-4 w-4 text-green-500" />;
    case "Offered":
      return <PhoneOutgoing className="mr-2 h-4 w-4 text-blue-500" />;
    case "Not PickedUp":
      return <PhoneMissed className="mr-2 h-4 w-4 text-yellow-500" />;
    case "Rejected Offer":
    case "Rejected First Round":
    case "Rejected Second Round":
      return <X className="mr-2 h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

interface OnboardTrackerFormProps {
  onSubmit: (data: FormValues) => void;
}

const OnboardTrackerForm = ({ onSubmit }: OnboardTrackerFormProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      jobTitle: "",
      candidateName: "",
      jobLocation: "",
      recruiterName: "",
      status: "Offered",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    toast({
      title: "Onboarding record created",
      description: `${values.candidateName} is now tracked with status: ${values.status}`,
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">Add Onboarding Record</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Onboarding Record</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <Building className="mx-2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Client name" {...field} className="border-0 focus-visible:ring-0" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <Briefcase className="mx-2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Job title" {...field} className="border-0 focus-visible:ring-0" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="candidateName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <User className="mx-2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Candidate name" {...field} className="border-0 focus-visible:ring-0" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="jobLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Location</FormLabel>
                    <FormControl>
                      <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <MapPin className="mx-2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Job location" {...field} className="border-0 focus-visible:ring-0" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="recruiterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recruiter Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <User className="mx-2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Recruiter name" {...field} className="border-0 focus-visible:ring-0" />
                      </div>
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
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Offered">
                          <div className="flex items-center">
                            <PhoneOutgoing className="mr-2 h-4 w-4 text-blue-500" />
                            Offered
                          </div>
                        </SelectItem>
                        <SelectItem value="Joined">
                          <div className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Joined
                          </div>
                        </SelectItem>
                        <SelectItem value="Rejected Offer">
                          <div className="flex items-center">
                            <X className="mr-2 h-4 w-4 text-red-500" />
                            Rejected Offer
                          </div>
                        </SelectItem>
                        <SelectItem value="Not PickedUp">
                          <div className="flex items-center">
                            <PhoneMissed className="mr-2 h-4 w-4 text-yellow-500" />
                            Not PickedUp
                          </div>
                        </SelectItem>
                        <SelectItem value="Rejected Second Round">
                          <div className="flex items-center">
                            <X className="mr-2 h-4 w-4 text-red-500" />
                            Rejected Second Round
                          </div>
                        </SelectItem>
                        <SelectItem value="Rejected First Round">
                          <div className="flex items-center">
                            <X className="mr-2 h-4 w-4 text-red-500" />
                            Rejected First Round
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardTrackerForm;
