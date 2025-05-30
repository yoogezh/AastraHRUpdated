
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRBAC } from '@/context/RBACContext';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook to check if the current user has permission for a specific resource and action
 * @param resource - The resource to check permission for
 * @param action - The required action ('read' or 'write')
 * @param redirectOnFailure - Whether to redirect to home page if permission check fails
 * @returns - Boolean indicating if user has permission
 */
export const usePermission = (
  resource: string,
  action: 'read' | 'write' = 'read',
  redirectOnFailure: boolean = true
): boolean => {
  const { checkPermission, isLoading } = useRBAC();
  const navigate = useNavigate();
  
  const hasPermission = checkPermission(resource, action);
  
  useEffect(() => {
    if (!isLoading && !hasPermission && redirectOnFailure) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this resource',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [hasPermission, isLoading, navigate, redirectOnFailure]);

  return hasPermission;
};

export default usePermission;
