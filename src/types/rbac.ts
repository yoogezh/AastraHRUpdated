
export type Permission = {
  resource: string;
  action: 'read' | 'write' | 'none';
};

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleFormData {
  name: string;
  description: string;
  permissions: Permission[];
}

// Import at the top to avoid hoisting issues
import { User, UserRole } from './index';

// Fix the UserWithRole interface to properly extend User
export interface UserWithRole extends Omit<User, 'role'> {
  role: Role;
  userRole?: UserRole; // Keep the original role field as optional
}

// Resource categories that appear in the permissions UI
export interface ResourceCategory {
  name: string;
  description: string;
  resources: Resource[];
}

export interface Resource {
  name: string;
  description: string;
  key: string;
}

// Predefined resources for permissions
export const resourceCategories: ResourceCategory[] = [
  {
    name: 'Category',
    description: 'Organize assets into defined groups.',
    resources: [
      { name: 'Category', description: 'Organize assets into defined groups.', key: 'category' },
    ]
  },
  {
    name: 'Room (Sub Category)',
    description: 'Manage specific rooms for assets.',
    resources: [
      { name: 'Room', description: 'Manage specific rooms for assets.', key: 'room' },
    ]
  },
  {
    name: 'Area',
    description: 'Allocate assets to specific areas.',
    resources: [
      { name: 'Area', description: 'Allocate assets to specific areas.', key: 'area' },
    ]
  },
  {
    name: 'Asset Map',
    description: 'Visualize asset locations on a map.',
    resources: [
      { name: 'Asset Map', description: 'Visualize asset locations on a map.', key: 'assetMap' },
    ]
  },
  {
    name: 'Branch',
    description: 'Track and manage branch-level assets.',
    resources: [
      { name: 'Branch', description: 'Track and manage branch-level assets.', key: 'branch' },
    ]
  },
  {
    name: 'Gate',
    description: 'Control asset movement through gates.',
    resources: [
      { name: 'Gate', description: 'Control asset movement through gates.', key: 'gate' },
    ]
  },
  {
    name: 'Employee Map',
    description: 'Map assets to employees.',
    resources: [
      { name: 'Employee Map', description: 'Map assets to employees.', key: 'employeeMap' },
    ]
  }
];

// Tab names for the role creation UI
export const roleTabs = ['General', 'Add Master', 'Transfer', 'Status', 'User Profile', 'Approval', 'Access'];
