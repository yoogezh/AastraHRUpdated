
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { InterviewStatus } from "@/types";

interface FilterValues {
  startDate?: Date;
  endDate?: Date;
  candidateName?: string;
  interviewerName?: string;
  status?: InterviewStatus;
  isExternal?: boolean;
}

interface InterviewFilterProps {
  onFilter: (values: FilterValues) => void;
}

const InterviewFilter = ({ onFilter }: InterviewFilterProps) => {
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);
  
  const form = useForm<FilterValues>({
    defaultValues: {
      candidateName: "",
      interviewerName: "",
    },
  });

  const handleReset = () => {
    form.reset({
      startDate: undefined,
      endDate: undefined,
      candidateName: "",
      interviewerName: "",
      status: undefined,
      isExternal: undefined,
    });
    setIsFiltersApplied(false);
    onFilter({});
  };

  const handleApplyFilter = (data: FilterValues) => {
    onFilter(data);
    setIsFiltersApplied(true);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant={isFiltersApplied ? "default" : "outline"} 
          size="sm"
          className={cn(
            "flex items-center gap-2",
            isFiltersApplied && "bg-primary text-primary-foreground"
          )}
        >
          <Filter className="h-4 w-4" />
          {isFiltersApplied ? "Filters Applied" : "Filter"}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Interviews</SheetTitle>
          <SheetDescription>
            Apply filters to narrow down the interview results
          </SheetDescription>
        </SheetHeader>
        
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleApplyFilter)} 
            className="space-y-6 py-6"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a start date</span>
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
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick an end date</span>
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
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="candidateName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Filter by candidate name" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interviewerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interviewer Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Filter by interviewer name" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Any status" />
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
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isExternal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interviewer Type</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === "true" ? true : value === "false" ? false : undefined)} 
                      value={field.value !== undefined ? field.value.toString() : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Any type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">External</SelectItem>
                        <SelectItem value="false">Internal</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Button type="submit">
                Apply Filters
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default InterviewFilter;
