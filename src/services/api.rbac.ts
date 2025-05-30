
import { supabase } from './supabase';
import { Role, RoleFormData, Permission } from '@/types/rbac';
import { User } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Role Management
export const createRole = async (roleData: RoleFormData): Promise<Role | null> => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .insert([{
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating role:', error);
      toast({
        title: 'Error',
        description: `Failed to create role: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      permissions: data.permissions,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Unexpected error creating role:', error);
    toast({
      title: 'Error',
      description: 'An unexpected error occurred while creating the role',
      variant: 'destructive',
    });
    return null;
  }
};

export const getRoles = async (): Promise<Role[]> => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*');

    if (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: 'Error',
        description: `Failed to fetch roles: ${error.message}`,
        variant: 'destructive',
      });
      return [];
    }

    return data.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      createdAt: role.created_at,
      updatedAt: role.updated_at,
    }));
  } catch (error) {
    console.error('Unexpected error fetching roles:', error);
    toast({
      title: 'Error',
      description: 'An unexpected error occurred while fetching roles',
      variant: 'destructive',
    });
    return [];
  }
};

export const updateRole = async (id: string, roleData: Partial<RoleFormData>): Promise<Role | null> => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .update({
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: `Failed to update role: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      permissions: data.permissions,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Unexpected error updating role:', error);
    toast({
      title: 'Error',
      description: 'An unexpected error occurred while updating the role',
      variant: 'destructive',
    });
    return null;
  }
};

export const deleteRole = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting role:', error);
      toast({
        title: 'Error',
        description: `Failed to delete role: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting role:', error);
    toast({
      title: 'Error',
      description: 'An unexpected error occurred while deleting the role',
      variant: 'destructive',
    });
    return false;
  }
};

// User-Role Management
export const assignRoleToUser = async (userId: string, roleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .upsert([{
        user_id: userId,
        role_id: roleId,
        updated_at: new Date().toISOString(),
      }]);

    if (error) {
      console.error('Error assigning role to user:', error);
      toast({
        title: 'Error',
        description: `Failed to assign role: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error assigning role:', error);
    toast({
      title: 'Error',
      description: 'An unexpected error occurred while assigning the role',
      variant: 'destructive',
    });
    return false;
  }
};

export const getUserWithRole = async (userId: string): Promise<{ user: User; role: Role | null } | null> => {
  try {
    // Get user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return null;
    }

    // Get user's role
    const { data: userRoleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', userId)
      .single();

    if (roleError && roleError.code !== 'PGRST116') { // PGRST116 is not found error
      console.error('Error fetching user role:', roleError);
      return null;
    }

    let role = null;
    if (userRoleData) {
      const { data: roleData, error: roleDetailsError } = await supabase
        .from('roles')
        .select('*')
        .eq('id', userRoleData.role_id)
        .single();

      if (roleDetailsError) {
        console.error('Error fetching role details:', roleDetailsError);
      } else {
        role = {
          id: roleData.id,
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions,
          createdAt: roleData.created_at,
          updatedAt: roleData.updated_at,
        };
      }
    }

    return {
      user: {
        id: userData.id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        department: userData.department,
      },
      role,
    };
  } catch (error) {
    console.error('Unexpected error fetching user with role:', error);
    return null;
  }
};

// Helper function to check permissions
export const hasPermission = (
  userPermissions: Permission[] | undefined,
  resource: string,
  requiredAction: 'read' | 'write'
): boolean => {
  if (!userPermissions) return false;
  
  const permission = userPermissions.find(p => p.resource === resource);
  if (!permission) return false;
  
  if (requiredAction === 'read') {
    return permission.action === 'read' || permission.action === 'write';
  }
  
  return permission.action === 'write';
};
