
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FileBarChart, ListFilter, Users } from "lucide-react";

const ReportsPage = () => {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");
  
  // Mock data for the detailed report based on status
  const mockChartData = [
    { name: "Jan", count: 10, interviews: 8, hired: 6 },
    { name: "Feb", count: 15, interviews: 12, hired: 7 },
    { name: "Mar", count: 8, interviews: 6, hired: 4 },
    { name: "Apr", count: 12, interviews: 10, hired: 8 },
    { name: "May", count: 18, interviews: 14, hired: 9 },
    { name: "Jun", count: 14, interviews: 12, hired: 10 }
  ];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Reports</h1>
        {statusFilter && (
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
            <ListFilter className="h-4 w-4" />
            Filtering by: {statusFilter}
          </div>
        )}
      </div>
      
      <Card className="bg-white border-slate-200 shadow-md hover:shadow-lg transition-all">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <CardTitle className="flex items-center gap-2">
            {statusFilter ? (
              <>
                <Users className="h-5 w-5 text-primary" />
                {statusFilter} Candidates Report
              </>
            ) : (
              <>
                <FileBarChart className="h-5 w-5 text-primary" />
                All Candidates Report
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="pt-4">
              <div className="h-80 w-full bg-slate-50 p-4 rounded-xl shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Bar 
                      dataKey="count" 
                      name={statusFilter ? `${statusFilter} Candidates` : "All Candidates"} 
                      fill="#60a5fa" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      dataKey="interviews" 
                      name="Interviews" 
                      fill="#c4b5fd" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      dataKey="hired" 
                      name="Hired" 
                      fill="#4ade80" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-muted-foreground text-sm mt-4 text-center">
                This chart shows the distribution of {statusFilter ? `${statusFilter} candidates` : 'all candidates'} over time
              </p>
            </TabsContent>
            
            <TabsContent value="details">
              <div className="bg-slate-50 rounded-xl p-6 shadow-inner">
                <p className="text-slate-600">
                  This is a detailed report showing {statusFilter ? `candidates with status: ${statusFilter}` : 'all candidates'}. 
                  In a complete implementation, this would display detailed metrics and data tables filtered by relevant parameters.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="bg-white shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-500">Total Candidates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{statusFilter ? '24' : '78'}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-500">Conversion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{statusFilter === 'Hired' ? '48%' : '32%'}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-500">Avg. Time to Hire</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">18 days</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
