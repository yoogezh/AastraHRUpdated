
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { User } from "@/types";
import { z } from "zod";
import UserForm from "@/components/users/UserForm";
import { getRoles } from "@/services/api.rbac";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  username: z.string().min(3),
  name: z.string().min(1),
  email: z.string().email(),
  roleId: z.string().min(1),
  department: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  // Fetch user data
  const { 
    data: user, 
    isLoading: isLoadingUser, 
    error: userError 
  } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as User;
    },
    enabled: !!id,
  });

  // Fetch roles
  const { 
    data: roles = [], 
    isLoading: isLoadingRoles, 
    error: rolesError 
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: FormValues) => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('users')
        .update({
          username: userData.username,
          name: userData.name,
          email: userData.email,
          role: userData.roleId,
          department: userData.department || null,
        })
        .eq('id', id)
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update user: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (values: FormValues) => {
    await updateUserMutation.mutateAsync(values);
  };

  const isLoading = isLoadingUser || isLoadingRoles;
  const error = userError || rolesError;

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error || !user) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <p>Error loading user data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <UserForm
      initialData={user}
      roles={roles}
      onSubmit={handleSubmit}
      mode="edit"
    />
  );
};

export default EditUserPage;
