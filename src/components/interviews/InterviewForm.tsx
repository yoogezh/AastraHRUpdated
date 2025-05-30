
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { InterviewStatus, Interview } from "@/types";

const interviewSchema = z.object({
  interviewDate: z.date({
    required_error: "Interview date is required",
  }),
  candidateName: z.string().min(2, { message: "Candidate name is required" }),
  candidatePhone: z.string().min(10, { message: "Valid phone number is required" }),
  interviewerName: z.string().min(2, { message: "Interviewer name is required" }),
  isExternal: z.boolean().default(false),
  status: z.enum([
    'Excellent', 
    'Ok to Proceed', 
    'Average', 
    'Below Average',
    'Rejected', 
    'Hold', 
    'Not Interested', 
    'Yet to Call', 
    'Pending', 
    'Not Picked', 
    'Asked to Call Later', 
    'Dropped'
  ] as const, {
    required_error: "Status is required"
  }),
  remarks: z.string().optional(),
  interviewAmount: z.number().int().nonnegative().optional(),
});

interface InterviewFormProps {
  initialData?: Partial<Interview>;
  onSubmit: (data: z.infer<typeof interviewSchema>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const InterviewForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting
}: InterviewFormProps) => {
  const form = useForm<z.infer<typeof interviewSchema>>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      interviewDate: initialData.interviewDate ? new Date(initialData.interviewDate) : new Date(),
      candidateName: initialData.candidateName || "",
      candidatePhone: initialData.candidatePhone || "",
      interviewerName: initialData.interviewerName || "",
      isExternal: initialData.isExternal || false,
      status: initialData.status || "Pending",
      remarks: initialData.remarks || "",
      interviewAmount: initialData.interviewAmount || 0,
    }
  });

  const handleFormSubmit = (data: z.infer<typeof interviewSchema>) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Interview Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Interview Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="interviewDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Interview Date*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Status*</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Ok to Proceed">Ok to Proceed</SelectItem>
                      <SelectItem value="Average">Average</SelectItem>
                      <SelectItem value="Below Average">Below Average</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Hold">Hold</SelectItem>
                      <SelectItem value="Not Interested">Not Interested</SelectItem>
                      <SelectItem value="Yet to Call">Yet to Call</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Not Picked">Not Picked</SelectItem>
                      <SelectItem value="Asked to Call Later">Asked to Call Later</SelectItem>
                      <SelectItem value="Dropped">Dropped</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interviewAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Amount paid for conducting this interview (if applicable)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Candidate Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Candidate Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="candidateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidate Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter candidate name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="candidatePhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidate Phone Number*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter candidate phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Interviewer Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Interviewer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="interviewerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interviewer Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter interviewer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isExternal"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">External Interviewer</FormLabel>
                    <FormDescription>
                      Mark if the interview is conducted by an external interviewer
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter any additional remarks or notes"
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData.id ? "Update Interview" : "Add Interview"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InterviewForm;
