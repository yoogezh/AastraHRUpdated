
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X } from "lucide-react";

interface FilterField {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface AdvancedFilterProps {
  fields: FilterField[];
  onFilter: (filters: Record<string, any>) => void;
  initialFilters?: Record<string, any>;
}

const AdvancedFilter = ({ fields, onFilter, initialFilters = {} }: AdvancedFilterProps) => {
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(Object.values(initialFilters).filter(v => v).length);

  const handleChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const activeFiltersCount = Object.values(filters).filter(value => 
      value !== undefined && value !== null && value !== ""
    ).length;
    setActiveFilters(activeFiltersCount);
    onFilter(filters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const emptyFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {} as Record<string, any>);
    
    setFilters(emptyFilters);
    setActiveFilters(0);
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
          
          <div className="space-y-4">
            {fields.map((field) => {
              return React.cloneElement(field.component as React.ReactElement, {
                key: field.id,
                id: field.id,
                value: filters[field.id] || "",
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(field.id, e.target.value),
                onValueChange: (value: any) => handleChange(field.id, value),
              });
            })}
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

export default AdvancedFilter;
