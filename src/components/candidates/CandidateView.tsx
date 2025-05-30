import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Mail, Phone, MapPin, Briefcase, Calendar, FileText, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CandidateJSON {
  candidateId: number;
  candidateName: string;
  emailAddress: string | null;
  currentLocation: string | null;
  qualification: string | null;
  preferredLocation: string | null;
  mobileNumber: number | null;
  whatsAppNumber: number | null;
  clientName: string | null;
  overallExperience: string | null;
  relevantExperience: string | null;
  shortlistedBy: string | null;
  noticePeriod: string | null;
  currentlyServingNotice: boolean | null;
  currentlyHoldingOffer: boolean | null;
  currentOfferValue: string | null;
  currentCTC: number | null;
  expectedCTC: number | null;
  resumeUpload: string | null;
  primarySkills: string[] | null;
  secondarySkills: string[] | null;
  additionalRemarks: string | null;
  currentCompany: string | null;
  client: string | null;
  status: boolean | string;
}

interface CandidateViewProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateJSON | null;
}

const CandidateView = ({ isOpen, onClose, candidate }: CandidateViewProps) => {
  if (!candidate) return null;

  const getStatusBadge = (status: boolean | string) => {
    if (status === true || status === "true") {
      return <Badge className="bg-blue-500">Active</Badge>;
    }
    if (status === false || status === "false") {
      return <Badge variant="outline" className="text-gray-500 border-gray-500">Inactive</Badge>;
    }
    return <Badge>{String(status)}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span>{candidate.candidateName}</span>
            {getStatusBadge(candidate.status)}
          </DialogTitle>
          <DialogDescription>
            {candidate.qualification || 'Not specified'} based in {candidate.currentLocation || 'Not specified'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Personal Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.emailAddress || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.mobileNumber || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.currentLocation || "Not specified"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Professional Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.overallExperience || "N/A"} experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.noticePeriod || "N/A"} notice period</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {typeof candidate.expectedCTC === "number"
                        ? candidate.expectedCTC.toLocaleString()
                        : "Not specified"}{" "}
                      expected CTC
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Client Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Client Name</p>
                    <p>{candidate.clientName || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Preferred Location</p>
                    <p>{candidate.preferredLocation || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(candidate.primarySkills?.length || 0) > 0 || (candidate.secondarySkills?.length || 0) > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Skills</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {candidate.primarySkills?.map((skill, index) => (
                    <Badge key={`p-${index}`} className="bg-blue-50 text-blue-800">{skill.trim()}</Badge>
                  ))}
                  {candidate.secondarySkills?.map((skill, index) => (
                    <Badge key={`s-${index}`} variant="outline" className="bg-gray-50 text-gray-800">{skill.trim()}</Badge>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{candidate.currentCompany || "Not specified"}</p>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current CTC</p>
                  <p>{candidate.currentCTC?.toLocaleString() || "Not specified"}</p>
                </div>
              </CardContent>
            </Card>

            {candidate.additionalRemarks && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Additional Remarks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{candidate.additionalRemarks}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resume</CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.resumeUpload ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Resume</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                        <a href={candidate.resumeUpload} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          View
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                        <a href={candidate.resumeUpload} download>
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No resume uploaded</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateView;
