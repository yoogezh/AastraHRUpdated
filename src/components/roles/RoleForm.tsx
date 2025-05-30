
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createRole, updateRole } from "@/services/api.rbac";
import { Role, Permission } from "@/types/rbac";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const resources = ['candidates', 'jobs', 'clients', 'employees', 'reports', 'interviews'];

interface RoleFormData {
  name: string;
  description: string;
  permissions: Permission[];
}

export interface RoleFormProps {
  initialData?: Role;
  mode: 'create' | 'edit';
}

const RoleForm = ({ initialData, mode }: RoleFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const initializePermissions = (): Permission[] => {
    if (initialData?.permissions) {
      return initialData.permissions;
    }
    
    return resources.map(resource => ({
      resource: resource,
      action: 'none' as const
    }));
  };

  const [formData, setFormData] = useState<RoleFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    permissions: initializePermissions()
  });

  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: "Success",
        description: "Role created successfully"
      });
      navigate('/roles');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: RoleFormData }) => updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: "Success",
        description: "Role updated successfully"
      });
      navigate('/roles');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure all required fields are present
    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and description are required",
        variant: "destructive"
      });
      return;
    }

    // Ensure permissions have required properties
    const validPermissions: Permission[] = formData.permissions.map(permission => ({
      resource: permission.resource,
      action: permission.action
    }));

    const roleData: RoleFormData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      permissions: validPermissions
    };

    if (mode === 'create') {
      createMutation.mutate(roleData);
    } else if (initialData?.id) {
      updateMutation.mutate({ 
        id: initialData.id, 
        data: roleData
      });
    }
  };

  const handlePermissionChange = (index: number, action: 'none' | 'read' | 'write') => {
    const newPermissions = [...formData.permissions];
    newPermissions[index] = {
      ...newPermissions[index],
      action
    };
    setFormData(prev => ({
      ...prev,
      permissions: newPermissions
    }));
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create New Role' : 'Edit Role'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Role Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter role name"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter role description"
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.permissions.map((permission, index) => (
                  <Card key={permission.resource} className="p-4">
                    <div className="space-y-3">
                      <h4 className="font-medium capitalize">{permission.resource}</h4>
                      <Select
                        value={permission.action}
                        onValueChange={(value: 'none' | 'read' | 'write') => 
                          handlePermissionChange(index, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="write">Write</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (mode === 'create' ? 'Create Role' : 'Update Role')}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/roles')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleForm;
