
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { User } from "@/types";
import { Role } from "@/types/rbac";
import UsersList from "@/components/users/UsersList";
import { toast } from "@/components/ui/use-toast";
import { getRoles } from "@/services/api.rbac";

const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  // Fetch users
  const { 
    data: users = [], 
    isLoading: isLoadingUsers, 
    error: usersError 
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase.from('users').select('*');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as User[];
    },
  });
  
  // Fetch roles for mapping role IDs to names
  const { 
    data: roles = [], 
    isLoading: isLoadingRoles, 
    error: rolesError 
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
  
  // Create a map of role IDs to role names
  const roleNames = roles.reduce<Record<string, string>>((acc, role) => {
    acc[role.id] = role.name;
    return acc;
  }, {});

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const handleDeleteUser = async (userId: string) => {
    await deleteUserMutation.mutateAsync(userId);
  };

  const isLoading = isLoadingUsers || isLoadingRoles;
  const error = usersError || rolesError;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">User Management</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <p>Error loading data. Please try again later.</p>
        </div>
      ) : (
        <UsersList 
          users={users} 
          roleNames={roleNames} 
          onDelete={handleDeleteUser} 
        />
      )}
    </div>
  );
};

export default UsersPage;
