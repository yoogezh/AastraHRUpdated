
import React, { ReactNode } from 'react';
import { useRBAC } from '@/context/RBACContext';

interface PermissionGuardProps {
  resource: string;
  action?: 'read' | 'write';
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Component to conditionally render content based on user permissions
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  resource, 
  action = 'read', 
  fallback = null, 
  children 
}) => {
  const { checkPermission } = useRBAC();
  
  if (checkPermission(resource, action)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default PermissionGuard;
