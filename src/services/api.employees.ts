
import { Employee, UserType } from "@/types";
import { supabase } from './supabase';

// Mock employee data
const mockEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "EMP001",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.johnson@company.com",
    phone: "123-456-7890",
    joinedDate: "2023-01-15",
    password: "hashed_password_1",
    userTypeId: "1",
    department: "Engineering",
    designation: "Senior Developer",
    location: "San Francisco",
    employmentType: "Full-time",
    dateOfBirth: "1990-05-20",
    age: 33,
    gender: "Male",
    maritalStatus: "Married",
    uan: "1234567890",
    pan: "ABCDE1234F",
    aadharNumber: "1234 5678 9012",
    passportNumber: "A1234567",
    personalPhoneNumber: "987-654-3210",
    emergencyContactPerson: "Emily Johnson",
    permanentAddress: "123 Oak Street, San Francisco, CA",
    currentAddress: "456 Maple Avenue, San Francisco, CA",
    emergencyPhoneNo: "111-222-3333",
    personalEmailAddress: "robert.personal@example.com"
  },
  {
    id: "2",
    employeeId: "EMP002",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@company.com",
    phone: "234-567-8901",
    joinedDate: "2023-02-10",
    password: "hashed_password_2",
    userTypeId: "2",
    department: "Design",
    designation: "UI/UX Designer",
    location: "New York",
    employmentType: "Full-time",
    dateOfBirth: "1992-08-15",
    age: 31,
    gender: "Female",
    maritalStatus: "Single",
    uan: "0987654321",
    pan: "FGHIJ5678K",
    aadharNumber: "9876 5432 1098",
    passportNumber: "B9876543",
    personalPhoneNumber: "345-678-9012",
    emergencyContactPerson: "Michael Williams",
    permanentAddress: "789 Pine Street, New York, NY",
    currentAddress: "789 Pine Street, New York, NY",
    emergencyPhoneNo: "444-555-6666",
    personalEmailAddress: "sarah.personal@example.com"
  }
];

// Mock user types
const mockUserTypes: UserType[] = [
  {
    id: "1",
    userType: "Administrator",
    description: "Full access to all system features and settings"
  },
  {
    id: "2",
    userType: "HR Manager",
    description: "Access to employee records and HR functions"
  },
  {
    id: "3",
    userType: "Recruiter",
    description: "Access to candidate records and recruitment functions"
  },
  {
    id: "4",
    userType: "Employee",
    description: "Limited access to personal information and company resources"
  }
];

// Employee API functions
export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase.from('employees').select('*');
    if (error || !data || data.length === 0) {
      console.log("Using mock employee data", error);
      return mockEmployees;
    }
    return data as Employee[];
  } catch (err) {
    console.error("Error fetching employees:", err);
    return mockEmployees;
  }
};

export const createEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newEmployee: Employee = {
    id: `employee-${Date.now()}`,
    ...employee
  };
  
  try {
    // Try to save to Supabase
    const { data, error } = await supabase.from('employees').insert([newEmployee]).select().single();
    
    if (error) {
      console.log("Using mock employee creation", error);
      return newEmployee;
    }
    
    return data as Employee;
  } catch (err) {
    console.error("Error creating employee:", err);
    return newEmployee;
  }
};

export const updateEmployee = async (id: string, employee: Partial<Employee>): Promise<Employee> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const existingEmployee = mockEmployees.find(e => e.id === id);
  if (!existingEmployee) {
    throw new Error(`Employee with ID ${id} not found`);
  }
  
  const updatedEmployee = {
    ...existingEmployee,
    ...employee
  };
  
  try {
    // Try to update in Supabase
    const { data, error } = await supabase
      .from('employees')
      .update(employee)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.log("Using mock employee update", error);
      return updatedEmployee;
    }
    
    return data as Employee;
  } catch (err) {
    console.error("Error updating employee:", err);
    return updatedEmployee;
  }
};

export const deleteEmployee = async (id: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  try {
    // Try to delete from Supabase
    const { error } = await supabase.from('employees').delete().eq('id', id);
    
    if (error) {
      console.log("Using mock employee deletion", error);
    }
    
    return true;
  } catch (err) {
    console.error("Error deleting employee:", err);
    return true;
  }
};

// User Types API functions
export const fetchUserTypes = async (): Promise<UserType[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase.from('user_types').select('*');
    if (error || !data || data.length === 0) {
      console.log("Using mock user types data", error);
      return mockUserTypes;
    }
    return data as UserType[];
  } catch (err) {
    console.error("Error fetching user types:", err);
    return mockUserTypes;
  }
};

export const createUserType = async (userType: Omit<UserType, 'id'>): Promise<UserType> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newUserType: UserType = {
    id: `usertype-${Date.now()}`,
    ...userType
  };
  
  try {
    // Try to save to Supabase
    const { data, error } = await supabase.from('user_types').insert([newUserType]).select().single();
    
    if (error) {
      console.log("Using mock user type creation", error);
      return newUserType;
    }
    
    return data as UserType;
  } catch (err) {
    console.error("Error creating user type:", err);
    return newUserType;
  }
};
