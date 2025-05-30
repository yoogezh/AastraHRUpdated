
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@/services/api.rbac";
import RoleForm from "@/components/roles/RoleForm";

const EditRolePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const role = roles?.find((r) => r.id === id);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!role) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <p>Role not found</p>
        </div>
      </div>
    );
  }

  return <RoleForm initialData={role} mode="edit" />;
};

export default EditRolePage;
