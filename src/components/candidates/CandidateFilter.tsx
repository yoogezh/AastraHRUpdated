import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Filter, 
  X
} from "lucide-react";
import { CandidateStatus } from "@/types";

const statusOptions: CandidateStatus[] = [
  "Excellent",
  "Ok to Proceed",
  "Average",
  "Rejected",
  "Hold",
  "Not Interested",
  "Yet to Call",
  "Pending",
  "Not Picked",
  "Asked to Call Later",
  "Dropped"
];

interface CandidateFilterProps {
  onFilter: (filters: Record<string, any>) => void;
}

const CandidateFilter = ({ onFilter }: CandidateFilterProps) => {
  const [filters, setFilters] = useState<Record<string, any>>({
    clientName: "",
    status: "",
    candidateStatus: "",
    minExp: "",
    maxExp: "",
    currentLocation: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    console.log("Filter changed:", key, "->", value); // Debug log
  };

  const handleApplyFilters = () => {
    const activeFiltersCount = Object.values(filters).filter(value => value && value !== "").length;
    setActiveFilters(activeFiltersCount);
    console.log("Applying filters:", filters); // Debug log
    onFilter(filters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      clientName: "",
      status: "",
      candidateStatus: "",
      minExp: "",
      maxExp: "",
      currentLocation: "",
    };
    setFilters(emptyFilters);
    setActiveFilters(0);
    console.log("Resetting filters"); // Debug log
    onFilter(emptyFilters);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1"
        >
          <Filter className="h-4 w-4" />
          Filter
          {activeFilters > 0 && (
            <span className="ml-1 rounded-full bg-primary w-5 h-5 text-[10px] text-primary-foreground flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground"
              onClick={handleResetFilters}
            >
              <X className="h-4 w-4 mr-1" /> Clear all
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              placeholder="Filter by client name"
              value={filters.clientName}
              onChange={(e) => handleChange('clientName', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Active Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select active status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="candidateStatus">Candidate Status</Label>
            <Select
              value={filters.candidateStatus}
              onValueChange={(value) => handleChange('candidateStatus', value)}
            >
              <SelectTrigger id="candidateStatus">
                <SelectValue placeholder="Select candidate status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="minExp">Min Experience</Label>
              <Input
                id="minExp"
                type="number"
                placeholder="Min years"
                value={filters.minExp}
                onChange={(e) => handleChange('minExp', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxExp">Max Experience</Label>
              <Input
                id="maxExp"
                type="number"
                placeholder="Max years"
                value={filters.maxExp}
                onChange={(e) => handleChange('maxExp', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currentLocation">Location</Label>
            <Input
              id="currentLocation"
              placeholder="Filter by location"
              value={filters.currentLocation}
              onChange={(e) => handleChange('currentLocation', e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-end space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CandidateFilter;