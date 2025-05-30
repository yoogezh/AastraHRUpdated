import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Candidate, CandidateStatus } from "@/types";
import { Plus, Search, User, FileSpreadsheet, Edit, MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CandidateForm from "@/components/candidates/CandidateForm";
import CandidateView from "@/components/candidates/CandidateView";
import CandidateFilter from "@/components/candidates/CandidateFilter";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fetchAllCandidates,
  createCandidate,
  editCandidate
} from "../store/action/FormAction";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/Store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CandidatesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const dispatch = useDispatch<AppDispatch>();
  const { candidates, loading, error } = useSelector((state: RootState) => ({
    candidates: state.candidates.candidates,
    loading: state.candidates.loading,
    error: state.candidates.error
  }));

  useEffect(() => {
    dispatch(fetchAllCandidates());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error]);

  const handleCreateCandidate = async (candidateData: any) => {
    setIsSubmitting(true);
    try {
      const { resume, ...restData } = candidateData;
      let resumeUrl = "";

      if (resume) {
        resumeUrl = `https://localhost:44309/api/${resume.name}`;
      }

      await dispatch(createCandidate({ ...restData, resumeUrl }));
      setIsAddDialogOpen(false);
      toast({
        title: "Candidate Created",
        description: "Candidate successfully added",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add candidate",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCandidate = async (candidateData: any) => {
    setIsSubmitting(true);
    try {
      if (!selectedCandidate) return;
      
      const { resume, ...restData } = candidateData;
      let resumeUrl = selectedCandidate.resumeUrl; // Keep existing if not changed

      if (resume && resume instanceof File) {
        resumeUrl = `https://localhost:44309/api/${resume.name}`;
      }

      await dispatch(editCandidate(selectedCandidate.candidateId, { ...restData, resumeUrl }));
      setIsEditDialogOpen(false);
      toast({
        title: "Candidate Updated",
        description: "Candidate successfully updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update candidate",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsViewDialogOpen(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsEditDialogOpen(true);
  };

  const handleFilter = (filterValues: Record<string, any>) => {
     console.log("Filter values received:", filterValues);
    setFilters(filterValues);
  };

  const exportToExcel = () => {
    if (!candidates || candidates.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no candidates to export.",
        variant: "destructive",
      });
      return;
    }

    const workbookData = candidates.map((candidate) => ({
      candidateName: candidate.candidateName,
      emailAddress: candidate.emailAddress,
      currentLocation: candidate.currentLocation,
      qualification: candidate.qualification || "N/A",
      preferredLocation: candidate.preferredLocation || "N/A",
      mobileNumber: candidate.mobileNumber,
      whatsAppNumber: candidate.whatsAppNumber || "N/A",
      clientName: candidate.clientName || "N/A",
      overallExperience: candidate.overallExperience,
      relevantExperience: candidate.relevantExperience,
      shortlistedBy: candidate.shortlistedBy || "N/A",
      noticePeriod: candidate.noticePeriod,
      currentlyServingNotice: candidate.currentlyServingNotice ? "Yes" : "No",
      currentlyHoldingOffer: candidate.currentlyHoldingOffer ? "Yes" : "No",
      currentOfferValue: candidate.currentOfferValue || 0,
      currentCTC: candidate.currentCTC,
      expectedCTC: candidate.expectedCTC,
      primarySkills: Array.isArray(candidate.primarySkills) 
        ? candidate.primarySkills.join(", ") 
        : candidate.primarySkills || "N/A",
      secondarySkills: Array.isArray(candidate.secondarySkills)
        ? candidate.secondarySkills.join(", ")
        : candidate.secondarySkills || "N/A",
      additionalRemarks: candidate.additionalRemarks || "N/A",
      currentCompany: candidate.currentCompany || "N/A",
      client: candidate.client || "N/A",
      status: candidate.status === true ? "Active" : "Inactive",
      candidateStatus: candidate.candidateStatus || "No Status",
    }));

    const worksheet = XLSX.utils.json_to_sheet(workbookData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
    XLSX.writeFile(workbook, "Candidates_Report.xlsx");

    toast({
      title: "Export successful",
      description: "Candidate data has been exported to Excel.",
    });
  };

 // Replace the filteredCandidates logic in your CandidatesPage component with this:

const filteredCandidates = candidates && Array.isArray(candidates)
  ? candidates.filter((candidate) => {
      // Search term matching
      const matchesSearch = !searchTerm || 
        (candidate.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (candidate.clientName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ?? false) ||
        (candidate.currentLocation?.toLowerCase()?.includes(searchTerm.toLowerCase()) ?? false) ||
        (candidate.qualification?.toLowerCase()?.includes(searchTerm.toLowerCase()) ?? false) ||
        (candidate.candidateStatus?.toLowerCase()?.includes(searchTerm.toLowerCase()) ?? false);

      // Filter matching
      let matchesFilters = true;

      // Client name filter
      if (filters?.clientName && filters.clientName.trim() !== "") {
        matchesFilters = matchesFilters && 
          (candidate.clientName?.toLowerCase()?.includes(filters.clientName.toLowerCase()) ?? false);
      }

      // Active/Inactive status filter
      if (filters?.status && filters.status !== "") {
        if (filters.status === "Active") {
          matchesFilters = matchesFilters && candidate.status === true;
        } else if (filters.status === "Inactive") {
          matchesFilters = matchesFilters && candidate.status === false;
        }
      }

      // Candidate status filter
      if (filters?.candidateStatus && filters.candidateStatus !== "") {
        matchesFilters = matchesFilters && 
          (candidate.candidateStatus === filters.candidateStatus);
      }

      // Experience filters - handle null values properly
      if (filters?.minExp && filters.minExp !== "") {
        const minExp = parseFloat(filters.minExp);
        if (!isNaN(minExp)) {
          matchesFilters = matchesFilters && 
            ((candidate.overallExperience ?? 0) >= minExp);
        }
      }
      
      if (filters?.maxExp && filters.maxExp !== "") {
        const maxExp = parseFloat(filters.maxExp);
        if (!isNaN(maxExp)) {
          matchesFilters = matchesFilters && 
            ((candidate.overallExperience ?? 0) <= maxExp);
        }
      }

      // Location filter
      if (filters?.currentLocation && filters.currentLocation.trim() !== "") {
        matchesFilters = matchesFilters && 
          (candidate.currentLocation?.toLowerCase()?.includes(filters.currentLocation.toLowerCase()) ?? false);
      }

      return matchesSearch && matchesFilters;
    })
  : [];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; variant?: string }> = {
      "Excellent": { className: "bg-green-500 text-white" },
      "Ok to Proceed": { className: "bg-blue-500 text-white" },
      "Average": { className: "bg-yellow-500 text-black" },
      "Rejected": { className: "bg-red-500 text-white" },
      "Hold": { className: "bg-orange-500 text-white" },
      "Not Interested": { className: "bg-gray-500 text-white" },
      "Yet to Call": { className: "bg-purple-500 text-white" },
      "Pending": { className: "bg-blue-400 text-white" },
      "Not Picked": { className: "bg-gray-400 text-white" },
      "Asked to Call Later": { className: "bg-teal-500 text-white" },
      "Dropped": { className: "bg-red-600 text-white" }
    };

    const statusConfig = statusMap[status] || { className: "bg-gray-500 text-white" };
    
    return (
      <Badge className={statusConfig.className}>
        {status || 'Unknown'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Candidates
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
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Candidate
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-slate-50 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Candidate Records
              </CardTitle>
              <CardDescription>
                Manage and track all candidate details
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search candidates..."
                  className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <CandidateFilter onFilter={handleFilter} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notice</TableHead>
                  <TableHead>Expected CTC</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={8} className="py-3">
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
                ) : filteredCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-center">
                        <User className="h-12 w-12 text-muted-foreground opacity-30 mb-2" />
                        <h3 className="text-lg font-semibold">
                          No candidates found
                        </h3>
                        <p className="text-muted-foreground">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <TableRow
                      key={candidate.candidateId}
                      className="hover:bg-muted/50"
                    >
                      <TableCell 
                        className="font-medium cursor-pointer"
                        onClick={() => handleViewCandidate(candidate)}
                      >
                        {candidate.candidateName}
                      </TableCell>
                      <TableCell>{candidate.clientName || "N/A"}</TableCell>
                      <TableCell>{candidate.overallExperience || 0} years</TableCell>
                      <TableCell>{candidate.currentLocation || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(candidate.candidateStatus || 'Pending')}</TableCell>
                      <TableCell>{candidate.noticePeriod || "N/A"}</TableCell>
                      <TableCell>
                        {candidate.expectedCTC?.toLocaleString() || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewCandidate(candidate)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditCandidate(candidate)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[1400px] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Candidate</DialogTitle>
          </DialogHeader>
          <CandidateForm
            onSubmit={handleCreateCandidate}
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[1400px] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Candidate</DialogTitle>
          </DialogHeader>
          {selectedCandidate && (
            <CandidateForm
              initialValues={selectedCandidate}
              onSubmit={handleUpdateCandidate}
              onCancel={() => setIsEditDialogOpen(false)}
              isSubmitting={isSubmitting}
              isEditMode={true}
            />
          )}
        </DialogContent>
      </Dialog>

      <CandidateView
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        candidate={selectedCandidate}
      />
    </div>
  );
};

export default CandidatesPage;