
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Employee } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchUserTypes } from "@/services/api.employees";
import { CalendarIcon, User, Building, MapPin, UserCheck, Phone, Mail, CreditCard, Home, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const genderOptions = ["Male", "Female", "Other"];
const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
const employmentTypeOptions = ["Full-time", "Part-time", "Contract", "Internship"];

const employeeSchema = z.object({
  employeeId: z.string().min(1, { message: "Employee ID is required" }),
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  joinedDate: z.date({ required_error: "Joined date is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  userTypeId: z.string().min(1, { message: "User type is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  designation: z.string().min(1, { message: "Designation is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  employmentType: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  gender: z.enum(["Male", "Female", "Other"]),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]),
  uan: z.string().optional(),
  pan: z.string().optional(),
  aadharNumber: z.string().optional(),
  passportNumber: z.string().optional(),
  personalPhoneNumber: z.string().optional(),
  emergencyContactPerson: z.string().optional(),
  permanentAddress: z.string().optional(),
  currentAddress: z.string().optional(),
  emergencyPhoneNo: z.string().optional(),
  personalEmailAddress: z.string().email({ message: "Valid email is required" }).optional(),
});

interface EmployeeFormProps {
  initialData?: Partial<Employee>;
  onSubmit: (data: Partial<Employee>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const EmployeeForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting
}: EmployeeFormProps) => {
  const [sameAsPermAddress, setSameAsPermAddress] = useState(false);
  
  const { data: userTypes = [] } = useQuery({
    queryKey: ["userTypes"],
    queryFn: fetchUserTypes
  });

  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeId: initialData.employeeId || "",
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      joinedDate: initialData.joinedDate ? new Date(initialData.joinedDate) : new Date(),
      password: initialData.password || "",
      userTypeId: initialData.userTypeId || "",
      department: initialData.department || "",
      designation: initialData.designation || "",
      location: initialData.location || "",
      employmentType: (initialData.employmentType as any) || "Full-time",
      dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth) : new Date(),
      gender: (initialData.gender as any) || "Male",
      maritalStatus: (initialData.maritalStatus as any) || "Single",
      uan: initialData.uan || "",
      pan: initialData.pan || "",
      aadharNumber: initialData.aadharNumber || "",
      passportNumber: initialData.passportNumber || "",
      personalPhoneNumber: initialData.personalPhoneNumber || "",
      emergencyContactPerson: initialData.emergencyContactPerson || "",
      permanentAddress: initialData.permanentAddress || "",
      currentAddress: initialData.currentAddress || "",
      emergencyPhoneNo: initialData.emergencyPhoneNo || "",
      personalEmailAddress: initialData.personalEmailAddress || "",
    }
  });

  const handleSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameAsPermAddress(e.target.checked);
    if (e.target.checked) {
      const permAddress = form.getValues("permanentAddress");
      form.setValue("currentAddress", permAddress);
    }
  };

  const handleFormSubmit = (data: z.infer<typeof employeeSchema>) => {
    // Calculate age based on date of birth
    const today = new Date();
    const birthDate = new Date(data.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    onSubmit({
      ...data,
      age,
      joinedDate: format(data.joinedDate, "yyyy-MM-dd"),
      dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
            <User className="h-5 w-5 text-blue-600" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Employee ID*
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter employee ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Date of Birth*
                  </FormLabel>
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genderOptions.map(gender => (
                        <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {maritalStatusOptions.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
            <Phone className="h-5 w-5 text-green-600" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Work Email*
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Work email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Work Phone*
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Work phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personalPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Personal phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personalEmailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Personal email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Employment Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
            <Building className="h-5 w-5 text-purple-600" />
            Employment Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter designation" {...field} />
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
                    Work Location*
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter work location" {...field} />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employmentTypeOptions.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="joinedDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Joined Date*
                  </FormLabel>
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="userTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    User Type*
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.userType}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portal Password*</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Create password" {...field} />
                  </FormControl>
                  <FormDescription>
                    For employee portal access
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Government Documents Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
            <CreditCard className="h-5 w-5 text-orange-600" />
            Government Documents
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <FormField
              control={form.control}
              name="uan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UAN</FormLabel>
                  <FormControl>
                    <Input placeholder="Universal Account Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="pan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN</FormLabel>
                  <FormControl>
                    <Input placeholder="Permanent Account Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="aadharNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhaar Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Aadhaar card number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="passportNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Passport number if available" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address & Emergency Contact Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
            <Home className="h-5 w-5 text-teal-600" />
            Address & Emergency Contact
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="permanentAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permanent Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Full permanent address" 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currentAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Full current address" 
                        className="min-h-24"
                        {...field} 
                        disabled={sameAsPermAddress}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sameAddress"
                checked={sameAsPermAddress}
                onChange={handleSameAddressChange}
                className="rounded border-gray-300"
              />
              <label htmlFor="sameAddress" className="text-sm">
                Current address same as permanent address
              </label>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="emergencyContactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Emergency Contact Person
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Name of emergency contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emergencyPhoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Emergency contact phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Employee"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmployeeForm;
