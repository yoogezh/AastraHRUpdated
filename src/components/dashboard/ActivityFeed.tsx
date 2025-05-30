
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardMetrics } from "@/types";
import { Calendar, Briefcase, User, FileText } from "lucide-react";
import { format } from "date-fns";

interface ActivityFeedProps {
  activities: DashboardMetrics['recentActivity'];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'client':
        return <Briefcase className="h-4 w-4 text-aastra-blue" />;
      case 'job':
        return <FileText className="h-4 w-4 text-aastra-teal" />;
      case 'candidate':
        return <User className="h-4 w-4 text-aastra-indigo" />;
      case 'interview':
        return <Calendar className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy - h:mm a');
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className="mt-1">{getIcon(activity.type)}</div>
              <div>
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
