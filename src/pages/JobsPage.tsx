
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/services/api";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JobDescription } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import JobForm from "@/components/jobs/JobForm";

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs
  });
  
  const filteredJobs = jobs.filter(job =>
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWorkTypeBadge = (workType: string) => {
    switch (workType) {
      case 'Onsite':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Onsite</Badge>;
      case 'Offshore':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Offshore</Badge>;
      case 'Hybrid':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Hybrid</Badge>;
      default:
        return <Badge variant="outline">{workType}</Badge>;
    }
  };

  const getEmploymentTypeBadge = (employmentType: string) => {
    switch (employmentType) {
      case 'Contract':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Contract</Badge>;
      case 'Permanent':
        return <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">Permanent</Badge>;
      default:
        return <Badge variant="outline">{employmentType}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Job Descriptions</h1>
        <Button onClick={() => setIsJobFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Job
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Work Type</TableHead>
              <TableHead>Employment</TableHead>
              <TableHead>Positions</TableHead>
              <TableHead className="text-right">Experience</TableHead>
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
            ) : filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground opacity-30 mb-2" />
                    <h3 className="text-lg font-semibold">No jobs found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or add a new job
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job: JobDescription) => (
                <TableRow key={job.id} className="hover:bg-muted/50 cursor-pointer">
                  <TableCell className="font-medium">{job.jobTitle}</TableCell>
                  <TableCell>{job.companyName}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{getWorkTypeBadge(job.workType)}</TableCell>
                  <TableCell>{getEmploymentTypeBadge(job.employmentType)}</TableCell>
                  <TableCell>{job.noOfPositions}</TableCell>
                  <TableCell className="text-right">{job.experience} years</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Job Form Dialog */}
      <JobForm 
        isOpen={isJobFormOpen} 
        onClose={() => setIsJobFormOpen(false)} 
      />
    </div>
  );
};

export default JobsPage;
