
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { UserType } from "@/types";

const userTypeSchema = z.object({
  userType: z.string().min(2, { message: "User type is required" }),
  description: z.string().min(5, { message: "Please provide a description" })
});

interface UserTypeFormProps {
  initialData?: Partial<UserType>;
  onSubmit: (data: Partial<UserType>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const UserTypeForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting
}: UserTypeFormProps) => {
  const form = useForm<z.infer<typeof userTypeSchema>>({
    resolver: zodResolver(userTypeSchema),
    defaultValues: {
      userType: initialData.userType || "",
      description: initialData.description || ""
    }
  });

  const handleFormSubmit = (data: z.infer<typeof userTypeSchema>) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Type*</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Administrator, Manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description*</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the permissions and access levels for this user type"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save User Type"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserTypeForm;
