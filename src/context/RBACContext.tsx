
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role, Permission } from '@/types/rbac';
import { User } from '@/types';
import { getUserWithRole, hasPermission } from '@/services/api.rbac';
import { toast } from '@/components/ui/use-toast';

interface RBACContextType {
  currentUser: User | null;
  userRole: Role | null;
  isLoading: boolean;
  checkPermission: (resource: string, action: 'read' | 'write') => boolean;
  refreshUserRole: () => Promise<void>;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within a RBACProvider');
  }
  return context;
};

interface RBACProviderProps {
  children: ReactNode;
}

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user data on initial render
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        // In a real app, you'd get the current user ID from the auth system
        // For demo purposes, we'll use a mock user ID
        const mockUserId = 'current-user-id';
        const userWithRole = await getUserWithRole(mockUserId);
        
        if (userWithRole) {
          setCurrentUser(userWithRole.user);
          setUserRole(userWithRole.role);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to load user information',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
        toast({
          title: 'Error',
          description: 'Failed to load user information',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const checkPermission = (resource: string, action: 'read' | 'write'): boolean => {
    return hasPermission(userRole?.permissions, resource, action);
  };

  const refreshUserRole = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const userWithRole = await getUserWithRole(currentUser.id);
      if (userWithRole) {
        setUserRole(userWithRole.role);
      }
    } catch (error) {
      console.error('Error refreshing user role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RBACContext.Provider
      value={{
        currentUser,
        userRole,
        isLoading,
        checkPermission,
        refreshUserRole
      }}
    >
      {children}
    </RBACContext.Provider>
  );
};

// Higher-order component to protect routes
export function withRoleProtection(
  WrappedComponent: React.ComponentType,
  requiredResource: string,
  requiredAction: 'read' | 'write' = 'read'
) {
  return function ProtectedRoute(props: any) {
    const { checkPermission, isLoading } = useRBAC();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !checkPermission(requiredResource, requiredAction)) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access this page',
          variant: 'destructive',
        });
        navigate('/');
      }
    }, [isLoading, checkPermission, navigate]);

    if (isLoading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
}
