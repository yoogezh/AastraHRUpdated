
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const DashboardMetricCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className
}: DashboardMetricCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden rotate-card relative", 
      "bg-gradient-to-br from-white to-slate-50",
      "border-slate-100 shadow-md hover:shadow-lg",
      "transition-all duration-200 hover:scale-105",
      className
    )}>
      {/* Decorative elements for futuristic feel */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-purple-300/10 to-blue-300/10 rounded-full blur-lg"></div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-500">{value}</div>
            {description && (
              <p className="text-xs text-slate-500 mt-1">{description}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <span
                  className={cn(
                    "text-xs font-medium flex items-center rounded-full px-2 py-0.5",
                    trend.isPositive 
                      ? "text-green-600 bg-green-50" 
                      : "text-red-600 bg-red-50"
                  )}
                >
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-slate-500 ml-1">vs last month</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-inner">
            <div className="bg-gradient-to-tr from-primary/70 to-primary rounded-lg p-2 shadow-md">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardMetricCard;
