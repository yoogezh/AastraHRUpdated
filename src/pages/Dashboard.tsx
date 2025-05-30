
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardMetrics } from "@/services/api";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import StatusDistributionChart from "@/components/dashboard/StatusDistributionChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Users, FileText, Calendar, ChartBar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: fetchDashboardMetrics
  });

  const handleMetricCardClick = (metric: string) => {
    switch (metric) {
      case "clients":
        navigate("/clients");
        break;
      case "jobs":
        navigate("/jobs");
        break;
      case "candidates":
        navigate("/candidates");
        break;
      case "interviews":
        navigate("/interviews");
        break;
      default:
        navigate("/reports");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20 mb-2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 col-span-2" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (!metrics) {
    return <div>Error loading dashboard data</div>;
  }

  const { 
    totalClients, 
    totalJobs, 
    totalCandidates, 
    activeInterviews, 
    candidatesByStatus, 
    interviewMetrics, 
    recentActivity 
  } = metrics;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Dashboard</h1>
        <p className="text-slate-600 bg-slate-100 px-4 py-2 rounded-full text-sm shadow-sm">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => handleMetricCardClick("clients")} className="cursor-pointer">
          <DashboardMetricCard
            title="Total Clients"
            value={totalClients}
            icon={<Briefcase className="h-5 w-5 text-white" />}
            trend={{ value: 12, isPositive: true }}
          />
        </div>
        <div onClick={() => handleMetricCardClick("jobs")} className="cursor-pointer">
          <DashboardMetricCard
            title="Active Jobs"
            value={totalJobs}
            icon={<FileText className="h-5 w-5 text-white" />}
            trend={{ value: 8, isPositive: true }}
          />
        </div>
        <div onClick={() => handleMetricCardClick("candidates")} className="cursor-pointer">
          <DashboardMetricCard
            title="Candidates"
            value={totalCandidates}
            icon={<Users className="h-5 w-5 text-white" />}
            trend={{ value: 5, isPositive: true }}
          />
        </div>
        <div onClick={() => handleMetricCardClick("interviews")} className="cursor-pointer">
          <DashboardMetricCard
            title="Active Interviews"
            value={activeInterviews}
            icon={<Calendar className="h-5 w-5 text-white" />}
            trend={{ value: 3, isPositive: false }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatusDistributionChart data={candidatesByStatus} />
        
        <Card className="col-span-1 lg:col-span-1 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <ChartBar className="h-5 w-5 text-purple-400" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Interview Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-4">
            {/* Enhanced progress bars with light pastel styling */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-blue-600">Scheduled</span>
                <div className="px-3 py-0.5 rounded-full bg-blue-100 border border-blue-200 shadow-inner">
                  <span className="font-medium text-blue-600">{interviewMetrics.scheduled}</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200/50 to-blue-100/50 rounded-full blur-sm"></div>
                <Progress 
                  value={(interviewMetrics.scheduled / (interviewMetrics.scheduled + interviewMetrics.completed + interviewMetrics.pending)) * 100} 
                  className="h-3 bg-slate-100" 
                  indicatorColor="rgba(96, 165, 250, 0.9)"
                />
                <div className="absolute inset-0 border border-blue-200 rounded-full pointer-events-none"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-green-600">Completed</span>
                <div className="px-3 py-0.5 rounded-full bg-green-100 border border-green-200 shadow-inner">
                  <span className="font-medium text-green-600">{interviewMetrics.completed}</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-200/50 to-green-100/50 rounded-full blur-sm"></div>
                <Progress 
                  value={(interviewMetrics.completed / (interviewMetrics.scheduled + interviewMetrics.completed + interviewMetrics.pending)) * 100} 
                  className="h-3 bg-slate-100" 
                  indicatorColor="rgba(74, 222, 128, 0.9)"
                />
                <div className="absolute inset-0 border border-green-200 rounded-full pointer-events-none"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-amber-600">Pending</span>
                <div className="px-3 py-0.5 rounded-full bg-amber-100 border border-amber-200 shadow-inner">
                  <span className="font-medium text-amber-600">{interviewMetrics.pending}</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-200/50 to-amber-100/50 rounded-full blur-sm"></div>
                <Progress 
                  value={(interviewMetrics.pending / (interviewMetrics.scheduled + interviewMetrics.completed + interviewMetrics.pending)) * 100} 
                  className="h-3 bg-slate-100" 
                  indicatorColor="rgba(251, 191, 36, 0.9)"
                />
                <div className="absolute inset-0 border border-amber-200 rounded-full pointer-events-none"></div>
              </div>
            </div>

            {/* Decorative elements for light futuristic feel */}
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-70"></div>
            <div className="absolute top-4 right-8 w-1 h-1 bg-purple-300 rounded-full animate-pulse opacity-70"></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityFeed activities={recentActivity} />
      </div>
    </div>
  );
};

export default Dashboard;
