
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEmployees, createEmployee, fetchUserTypes, createUserType } from "@/services/api.employees";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Employee, UserType } from "@/types";
import { Plus, Search, Users, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import EmployeeForm from "@/components/employees/EmployeeForm";
import UserTypeForm from "@/components/employees/UserTypeForm";
import { toast } from "@/hooks/use-toast";

const EmployeesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUserTypeDialogOpen, setIsUserTypeDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("employees");
  
  const { data: employees = [], isLoading, refetch } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees
  });
  
  const { data: userTypes = [], refetch: refetchUserTypes } = useQuery({
    queryKey: ["userTypes"],
    queryFn: fetchUserTypes
  });
  
  const handleCreateEmployee = async (employeeData: Partial<Employee>) => {
    setIsSubmitting(true);
    try {
      await createEmployee(employeeData as Omit<Employee, 'id'>);
      refetch();
      setIsAddDialogOpen(false);
      toast({
        title: "Employee created",
        description: "Employee has been successfully added"
      });
    } catch (error) {
      console.error("Failed to create employee:", error);
      toast({
        title: "Error",
        description: "Failed to create employee",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCreateUserType = async (userTypeData: Partial<UserType>) => {
    setIsSubmitting(true);
    try {
      await createUserType(userTypeData as Omit<UserType, 'id'>);
      refetchUserTypes();
      setIsUserTypeDialogOpen(false);
      toast({
        title: "User type created",
        description: "User type has been successfully added"
      });
    } catch (error) {
      console.error("Failed to create user type:", error);
      toast({
        title: "Error",
        description: "Failed to create user type",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const filteredEmployees = employees.filter(employee =>
    `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUserTypes = userTypes.filter(type =>
    type.userType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Administrative Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsUserTypeDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add User Role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="employees" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="userTypes">User Roles</TabsTrigger>
        </TabsList>
        
        <div className="mt-4 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === "employees" ? "Search employees..." : "Search user roles..."}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <TabsContent value="employees" className="border rounded-md mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7} className="py-3">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Users className="h-12 w-12 text-muted-foreground opacity-30 mb-2" />
                      <h3 className="text-lg font-semibold">No employees found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or add a new employee
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className="hover:bg-muted/50 cursor-pointer">
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>{employee.location}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      {new Date(employee.joinedDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="userTypes" className="border rounded-md mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUserTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Settings className="h-12 w-12 text-muted-foreground opacity-30 mb-2" />
                      <h3 className="text-lg font-semibold">No user roles found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or add a new user role
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUserTypes.map((type) => (
                  <TableRow key={type.id} className="hover:bg-muted/50 cursor-pointer">
                    <TableCell className="font-medium">{type.userType}</TableCell>
                    <TableCell>{type.description}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="w-[90vw] max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            onSubmit={handleCreateEmployee}
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isUserTypeDialogOpen} onOpenChange={setIsUserTypeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User Role</DialogTitle>
          </DialogHeader>
          <UserTypeForm
            onSubmit={handleCreateUserType}
            onCancel={() => setIsUserTypeDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesPage;
