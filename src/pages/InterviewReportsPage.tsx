import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  FileText,
  User,
  Calendar,
  FileSpreadsheet,
  Plus,
  Search
} from "lucide-react";
import * as XLSX from 'xlsx';

import { fetchInterviewReports } from "@/services/api.interviews";
import { InterviewReport, InterviewStatus } from "@/types";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const InterviewReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: reports, isLoading } = useQuery({
    queryKey: ['interviewReports'],
    queryFn: fetchInterviewReports,
  });

  const exportToExcel = () => {
    if (!reports || reports.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no interview reports to export.",
        variant: "destructive",
      });
      return;
    }

    // Format the data for export
    const workbookData = reports.map(report => ({
      'Employee Name': report.employeeName,
      'Total Interviews': report.totalInterviews,
      'Excellent': report.statusCounts['Excellent'] || 0,
      'Ok to Proceed': report.statusCounts['Ok to Proceed'] || 0,
      'Average': report.statusCounts['Average'] || 0,
      'Below Average': report.statusCounts['Below Average'] || 0,
      'Rejected': report.statusCounts['Rejected'] || 0,
      'Hold': report.statusCounts['Hold'] || 0,
      'Not Interested': report.statusCounts['Not Interested'] || 0,
      'Yet to Call': report.statusCounts['Yet to Call'] || 0,
      'Pending': report.statusCounts['Pending'] || 0,
      'Not Picked': report.statusCounts['Not Picked'] || 0,
      'Asked to Call Later': report.statusCounts['Asked to Call Later'] || 0,
      'Dropped': report.statusCounts['Dropped'] || 0,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(workbookData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Interview Reports');
    
    // Generate Excel file
    XLSX.writeFile(workbook, 'Interview_Reports.xlsx');
    
    toast({
      title: "Export successful",
      description: "Interview reports have been exported to Excel.",
    });
  };

  const filteredReports = reports?.filter(report =>
    report.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Interview Reports
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
        </div>
      </div>

      <Card>
        <CardHeader className="bg-slate-50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Interview Reports
              </CardTitle>
              <CardDescription>
                Analyze and track interviewer performance
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employee..."
                className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredReports && filteredReports.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee Name</TableHead>
                    <TableHead className="text-right">Total Interviews</TableHead>
                    <TableHead className="text-right">Excellent</TableHead>
                    <TableHead className="text-right">Ok to Proceed</TableHead>
                    <TableHead className="text-right">Average</TableHead>
                    <TableHead className="text-right">Below Average</TableHead>
                    <TableHead className="text-right">Rejected</TableHead>
                    <TableHead className="text-right">Hold</TableHead>
                    <TableHead className="text-right">Not Interested</TableHead>
                    <TableHead className="text-right">Yet to Call</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                    <TableHead className="text-right">Not Picked</TableHead>
                    <TableHead className="text-right">Asked to Call Later</TableHead>
                    <TableHead className="text-right">Dropped</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.employeeName}>
                      <TableCell className="font-medium">{report.employeeName}</TableCell>
                      <TableCell className="text-right">{report.totalInterviews}</TableCell>
                      <TableCell className="text-right">{report.statusCounts['Excellent'] || 0}</TableCell>
                      <TableCell className="text-right">{report.statusCounts['Ok to Proceed'] || 0}</TableCell>
                      <TableCell className="text-right">{report.statusCounts['Average'] || 0}</TableCell>
                      <TableCell className="text-right">{report.statusCounts['Below Average'] || 0}</TableCell>
                      <TableCell className="text-right">{report.statusCounts['Rejected'] || 0}</TableCell>
                      <TableCell className="text-right">{report.statusCounts['Hold'] || 0}</TableCell>
                      <TableCell className="text-right">{report.statusCounts['Not Interested'] || 0}</TableCell>
                      <TableCell className="text-right">{report.statusCounts['Yet to Call'] || 0}</TableCell>
                      <TableCell className="text-right">{report.statusCounts['Pending'] || 0}</TableCell>
                      <TableCell className="text-right">{report.statusCounts['Not Picked'] || 0}</TableCell>
                      <TableCell className="text-right">{report.statusCounts['Asked to Call Later'] || 0}</TableCell>
                      <TableCell className="text-right">{report.statusCounts['Dropped'] || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No interview reports found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search term or check back later
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewReportsPage;
