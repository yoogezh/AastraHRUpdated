import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Plus,
  FileText,
  Search,
  FileSpreadsheet,
  User,
  Calendar,
  CheckCheck,
  X
} from "lucide-react";
import * as XLSX from 'xlsx';

import {
  fetchInterviews,
  fetchInterviewsByFilter,
  createInterview,
  updateInterview,
  deleteInterview,
} from "@/services/api.interviews";
import { Interview, InterviewStatus } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import InterviewForm from "@/components/interviews/InterviewForm";
import InterviewFilter from "@/components/interviews/InterviewFilter";

const InterviewsPage = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Convert the date objects to ISO strings for filtering
  const processedFilters = {
    ...filters,
    startDate: filters.startDate ? filters.startDate.toISOString().split('T')[0] : undefined,
    endDate: filters.endDate ? filters.endDate.toISOString().split('T')[0] : undefined,
  };

  const { data: interviews, isLoading } = useQuery({
    queryKey: ['interviews', processedFilters],
    queryFn: () => {
      // If no filters are applied, fetch all interviews
      if (Object.keys(processedFilters).length === 0 || 
          Object.values(processedFilters).every(v => v === undefined)) {
        return fetchInterviews();
      }
      // Otherwise, fetch filtered interviews
      return fetchInterviewsByFilter(processedFilters);
    }
  });

  const createMutation = useMutation({
    mutationFn: createInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['interviews']});
      toast({
        title: "Interview added",
        description: "The interview has been added successfully.",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add interview. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding interview:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Interview> }) => 
      updateInterview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['interviews']});
      toast({
        title: "Interview updated",
        description: "The interview has been updated successfully.",
      });
      setIsEditDialogOpen(false);
      setSelectedInterview(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update interview. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating interview:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['interviews']});
      toast({
        title: "Interview deleted",
        description: "The interview has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete interview. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting interview:", error);
    },
  });

  const handleAddInterview = (data: any) => {
    createMutation.mutate(data);
  };

  const handleEditInterview = (data: any) => {
    if (selectedInterview?.id) {
      updateMutation.mutate({
        id: selectedInterview.id,
        data,
      });
    }
  };

  const handleDeleteInterview = (id: string) => {
    if (window.confirm("Are you sure you want to delete this interview?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenEditDialog = (interview: Interview) => {
    setSelectedInterview(interview);
    setIsEditDialogOpen(true);
  };

  const handleFilter = (filterValues: Record<string, any>) => {
    setFilters(filterValues);
  };

  const exportToExcel = () => {
    if (!interviews || interviews.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no interviews to export.",
        variant: "destructive",
      });
      return;
    }

    // Format the data for export
    const workbookData = interviews.map(interview => ({
      'Date': format(new Date(interview.interviewDate), 'yyyy-MM-dd'),
      'Candidate Name': interview.candidateName,
      'Candidate Phone': interview.candidatePhone,
      'Interviewer Name': interview.interviewerName,
      'External': interview.isExternal ? 'Yes' : 'No',
      'Status': interview.status,
      'Remarks': interview.remarks || '',
      'Interview Amount': interview.interviewAmount || 0
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(workbookData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Interviews');
    
    // Generate Excel file
    XLSX.writeFile(workbook, 'Interviews_Report.xlsx');
    
    toast({
      title: "Export successful",
      description: "Interview data has been exported to Excel.",
    });
  };

  // Filter interviews based on search term
  const filteredInterviews = interviews?.filter(interview => 
    interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.interviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.candidatePhone.includes(searchTerm)
  );

  const getStatusBadgeVariant = (status: InterviewStatus) => {
    switch (status) {
      case 'Excellent':
        return 'default';
      case 'Ok to Proceed':
        return 'outline';
      case 'Average':
        return 'secondary';
      case 'Below Average':
        return 'destructive';
      case 'Rejected':
        return 'destructive';
      case 'Hold':
        return 'secondary';
      case 'Not Interested':
        return 'destructive';
      case 'Yet to Call':
        return 'secondary';
      case 'Pending':
        return 'secondary';
      case 'Not Picked':
        return 'destructive';
      case 'Asked to Call Later':
        return 'secondary';
      case 'Dropped':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Interviewer Tracker
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export to Excel
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Interview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl w-[90vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Interview</DialogTitle>
                <DialogDescription>
                  Fill the form below to add a new interview record
                </DialogDescription>
              </DialogHeader>
              <InterviewForm
                onSubmit={handleAddInterview}
                onCancel={() => setIsAddDialogOpen(false)}
                isSubmitting={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-slate-50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Interview Records
              </CardTitle>
              <CardDescription>
                Manage and track all interview details
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search interviews..."
                  className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <InterviewFilter onFilter={handleFilter} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredInterviews && filteredInterviews.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead>Candidate Name</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead>Interviewer</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterviews.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell className="font-medium">
                        {format(new Date(interview.interviewDate), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>{interview.candidateName}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {interview.candidatePhone}
                      </TableCell>
                      <TableCell>{interview.interviewerName}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {interview.isExternal ? (
                          <Badge variant="outline" className="bg-yellow-100 hover:bg-yellow-100 text-yellow-800 border-yellow-200">
                            External
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-blue-100 hover:bg-blue-100 text-blue-800 border-blue-200">
                            Internal
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(interview.status)}>
                          {interview.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleOpenEditDialog(interview)}
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit Interview</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteInterview(interview.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No interviews found</h3>
              <p className="text-muted-foreground mb-4">
                {Object.keys(filters).length > 0 
                  ? "Try adjusting your filters or search term"
                  : "Start by adding a new interview record"}
              </p>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Interview
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Interview Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-7xl w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Interview</DialogTitle>
            <DialogDescription>
              Update the interview details
            </DialogDescription>
          </DialogHeader>
          {selectedInterview && (
            <InterviewForm
              initialData={selectedInterview}
              onSubmit={handleEditInterview}
              onCancel={() => setIsEditDialogOpen(false)}
              isSubmitting={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterviewsPage;
