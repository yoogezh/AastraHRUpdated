// Define the common types used throughout the application

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export interface Client {
  id: string;
  companyName: string;
  address: string;
  location: string;
  contactPerson: string;
  emailId: string;
  phoneNo: string;
  whatsAppNumber?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobDescription {
  id: string;
  clientId: string;
  companyName: string;
  jobReferenceNumber: string;
  jobTitle: string;
  roleCategory: string;
  experience: number;
  jobDescription: string;
  location: string;
  noOfPositions: number;
  workType: 'Onsite' | 'Offshore' | 'Hybrid';
  employmentType: 'Contract' | 'Permanent';
  responsiblePerson: string;
  timing: string;
  noticePeriod: string;
  package: string;
  budget: number;
  educationMaster: string;
  educationBachelor: string;
  remarks?: string;
  anyCertification?: string;
  primarySkills: string[];
  secondarySkills: string[];
  frontEndSkills?: string[];
  backEndSkills?: string[];
  dbSkills?: string[];
}

export interface Candidate {
  candidateId: number; // renamed from 'id' to 'candidateId'
  candidateName: string;
  clientName: string | null;
  overallExperience: number | null;
  relevantExperience: number | null; // renamed from 'relevantExp'
  currentLocation: string;
  preferredLocation: string | boolean; // depending on usage
  qualification: string;
  noticePeriod: string | null;
  currentlyServingNotice: boolean | null;
  currentlyHoldingOffer: boolean | null;
  currentOfferValue?: string | null;
  expectedCTC: number | null; // renamed from 'expCTC'
  currentCTC: number | null;
  candidateStatus: string | null;
  mobileNumber: string | number;
  whatsAppNumber?: string | number;
  emailAddress: string;
  shortlistedBy: string | null;
  additionalRemarks?: string | null; // renamed from 'remarks'
  resumeUpload?: string | null; // renamed from 'resumeUrl'
  primarySkills: string[] | null;
  secondarySkills: string[] | null;
  currentCompany?: string | null;
   status: boolean;
  client?: string | null; // optional extra field seen in JSON
}
interface CandidateFilters {
  clientName?: string;
  status?: string;
  candidateStatus?: string;
  minExp?: string;
  maxExp?: string;
  currentLocation?: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joinedDate: string;
  password: string; // In a real app, this should not be stored or returned to the frontend
  userTypeId: string;
  department: string;
  designation: string;
  location: string;
  employmentType: string;
  dateOfBirth: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  uan?: string;
  pan?: string;
  aadharNumber?: string;
  passportNumber?: string;
  personalPhoneNumber?: string;
  emergencyContactPerson?: string;
  permanentAddress?: string;
  currentAddress?: string;
  emergencyPhoneNo?: string;
  personalEmailAddress?: string;
}

export interface UserType {
  id: string;
  userType: string;
  description: string;
}

export interface JobWebsiteCredential {
  id: string;
  websiteName: string;
  url: string;
  username: string;
  password: string; // In a real app, this should be encrypted
  remarks?: string;
}

export type CandidateStatus = 
  'Excellent' | 
  'Ok to Proceed' | 
  'Average' | 
  'Rejected' | 
  'Hold' | 
  'Not Interested' | 
  'Yet to Call' | 
  'Pending' | 
  'Not Picked' | 
  'Asked to Call Later' | 
  'Dropped';

export type InterviewStatus = 
  'Excellent' | 
  'Ok to Proceed' | 
  'Average' | 
  'Below Average' |
  'Rejected' | 
  'Hold' | 
  'Not Interested' | 
  'Yet to Call' | 
  'Pending' | 
  'Not Picked' | 
  'Asked to Call Later' | 
  'Dropped';

export type OnboardStatus = 
  'Offered' | 
  'Joined' | 
  'Rejected Offer' | 
  'Not PickedUp' | 
  'Rejected Second Round' | 
  'Rejected First Round';

// Dashboard metrics types
export interface DashboardMetrics {
  totalClients: number;
  totalJobs: number;
  totalCandidates: number;
  activeInterviews: number;
  candidatesByStatus: Record<CandidateStatus, number>;
  interviewMetrics: {
    scheduled: number;
    completed: number;
    pending: number;
  };
  recentActivity: {
    id: string;
    type: 'client' | 'job' | 'candidate' | 'interview';
    description: string;
    timestamp: string;
  }[];
}

// Interview tracker types
export interface Interview {
  id: string;
  interviewDate: string;
  candidateName: string;
  candidatePhone: string;
  interviewerName: string;
  isExternal: boolean;
  status: InterviewStatus;
  remarks?: string;
  interviewAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewReport {
  employeeName: string;
  totalInterviews: number;
  statusCounts: Record<InterviewStatus, number>;
  candidates: {
    id: string;
    name: string;
    status: InterviewStatus;
    interviewDate: string;
  }[];
}
