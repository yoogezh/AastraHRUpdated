
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@/services/api.rbac";
import RolesList from "@/components/roles/RolesList";

const RolesPage: React.FC = () => {
  const { 
    data: roles = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Role Management</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <p>Error loading roles. Please try again later.</p>
        </div>
      ) : (
        <RolesList roles={roles} onRefresh={refetch} />
      )}
    </div>
  );
};

export default RolesPage;
