
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { z } from "zod";
import UserForm from "@/components/users/UserForm";
import { getRoles } from "@/services/api.rbac";

const formSchema = z.object({
  username: z.string().min(3),
  name: z.string().min(1),
  email: z.string().email(),
  roleId: z.string().min(1),
  department: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateUserPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  // Fetch roles
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: FormValues) => {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            username: userData.username,
            name: userData.name,
            email: userData.email,
            role: userData.roleId,
            department: userData.department || null,
          }
        ])
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleSubmit = async (values: FormValues) => {
    await createUserMutation.mutateAsync(values);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <UserForm
      roles={roles}
      onSubmit={handleSubmit}
      mode="create"
    />
  );
};

export default CreateUserPage;
