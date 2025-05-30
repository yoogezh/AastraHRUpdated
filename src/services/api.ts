
import { Client, DashboardMetrics, JobDescription } from "@/types";
import { supabase } from './supabase';

// Mock data for our application
const mockClients: Client[] = [
  {
    id: "1",
    companyName: "Tech Solutions Inc",
    address: "123 Tech Park, Silicon Valley",
    location: "San Francisco, CA",
    contactPerson: "John Smith",
    emailId: "john.smith@techsolutions.com",
    phoneNo: "123-456-7890",
    whatsAppNumber: "123-456-7890",
    remarks: "Enterprise client with multiple ongoing projects",
    createdAt: "2023-01-15T08:30:00Z",
    updatedAt: "2023-04-20T14:45:00Z"
  },
  {
    id: "2",
    companyName: "Global Finance Ltd",
    address: "456 Wall Street",
    location: "New York, NY",
    contactPerson: "Sarah Johnson",
    emailId: "sarah.j@globalfinance.com",
    phoneNo: "987-654-3210",
    createdAt: "2023-02-10T10:15:00Z",
    updatedAt: "2023-05-05T11:20:00Z"
  },
  {
    id: "3",
    companyName: "Healthcare Systems",
    address: "789 Medical Drive",
    location: "Boston, MA",
    contactPerson: "David Wilson",
    emailId: "d.wilson@healthsys.com",
    phoneNo: "555-123-4567",
    whatsAppNumber: "555-123-4568",
    remarks: "Looking for specialized medical software developers",
    createdAt: "2023-03-05T09:45:00Z",
    updatedAt: "2023-06-12T16:30:00Z"
  }
];

const mockJobs: JobDescription[] = [
  {
    id: "1",
    clientId: "1",
    companyName: "Tech Solutions Inc",
    jobReferenceNumber: "TSI-DEV-001",
    jobTitle: "Senior React Developer",
    roleCategory: "Engineering", // Added missing required field
    experience: 5,
    jobDescription: "We are looking for a skilled React developer who can build and maintain high-quality web applications.",
    location: "San Francisco, CA",
    noOfPositions: 2,
    workType: "Hybrid",
    employmentType: "Permanent",
    responsiblePerson: "John Smith",
    timing: "Full-time",
    noticePeriod: "30 days",
    package: "Competitive",
    budget: 150000,
    educationMaster: "Computer Science or related field",
    educationBachelor: "Computer Science or related field",
    remarks: "Experience with TypeScript is a plus",
    anyCertification: "AWS Certified Developer preferred",
    primarySkills: ["React", "JavaScript", "TypeScript", "HTML", "CSS"],
    secondarySkills: ["Node.js", "Express", "MongoDB", "GraphQL"]
  },
  {
    id: "2",
    clientId: "2",
    companyName: "Global Finance Ltd",
    jobReferenceNumber: "GFL-DEV-002",
    jobTitle: "Full Stack Engineer",
    roleCategory: "Development", // Added missing required field
    experience: 3,
    jobDescription: "Seeking a full-stack developer to build enterprise financial applications.",
    location: "New York, NY",
    noOfPositions: 4,
    workType: "Onsite",
    employmentType: "Contract",
    responsiblePerson: "Sarah Johnson",
    timing: "Full-time",
    noticePeriod: "15 days",
    package: "Competitive with benefits",
    budget: 120000,
    educationMaster: "Not required",
    educationBachelor: "Computer Science or related field",
    remarks: "Must be familiar with financial systems",
    primarySkills: ["JavaScript", "Angular", "Python"],
    secondarySkills: ["SQL", "Docker", "AWS"]
  },
  {
    id: "3",
    clientId: "3",
    companyName: "Healthcare Systems",
    jobReferenceNumber: "HS-DEV-003",
    jobTitle: "Backend Developer",
    roleCategory: "Engineering", // Added missing required field
    experience: 4,
    jobDescription: "Join our team to develop secure healthcare applications with strict privacy requirements.",
    location: "Boston, MA",
    noOfPositions: 1,
    workType: "Offshore",
    employmentType: "Permanent",
    responsiblePerson: "David Wilson",
    timing: "Full-time",
    noticePeriod: "60 days",
    package: "Competitive",
    budget: 135000,
    educationMaster: "Computer Science, Engineering, or related field",
    educationBachelor: "Required",
    remarks: "HIPAA compliance experience needed",
    anyCertification: "Security certifications preferred",
    primarySkills: ["Java", "Spring Boot", "MySQL"],
    secondarySkills: ["Redis", "Kubernetes", "Kafka"],
    backEndSkills: ["Java", "Spring", "Hibernate"]
  }
];

const mockDashboardData: DashboardMetrics = {
  totalClients: 15,
  totalJobs: 42,
  totalCandidates: 187,
  activeInterviews: 23,
  candidatesByStatus: {
    "Excellent": 25,
    "Ok to Proceed": 45,
    "Average": 30,
    "Rejected": 20,
    "Hold": 15,
    "Not Interested": 10,
    "Yet to Call": 22,
    "Pending": 8,
    "Not Picked": 5,
    "Asked to Call Later": 7,
    "Dropped": 0
  },
  interviewMetrics: {
    scheduled: 35,
    completed: 27,
    pending: 8
  },
  recentActivity: [
    {
      id: "act1",
      type: "client",
      description: "New client added: Innovate Technologies",
      timestamp: "2023-06-15T10:23:00Z"
    },
    {
      id: "act2",
      type: "job",
      description: "New job opening: Senior React Developer at Tech Solutions",
      timestamp: "2023-06-14T14:45:00Z"
    },
    {
      id: "act3",
      type: "candidate",
      description: "Candidate James Wilson shortlisted for interview",
      timestamp: "2023-06-14T09:30:00Z"
    },
    {
      id: "act4",
      type: "interview",
      description: "Interview scheduled with Emma Brown for Java Developer position",
      timestamp: "2023-06-13T16:15:00Z"
    },
    {
      id: "act5",
      type: "candidate",
      description: "Candidate Michael Davis marked as 'Excellent'",
      timestamp: "2023-06-13T11:20:00Z"
    }
  ]
};

// API functions
export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase.from('dashboard_metrics').select('*').single();
    if (error || !data) {
      console.log("Using mock dashboard data", error);
      // Fallback to mock data if not available
      return mockDashboardData;
    }
    return data as DashboardMetrics;
  } catch (err) {
    console.error("Error fetching dashboard metrics:", err);
    return mockDashboardData;
  }
};

export const fetchClients = async (): Promise<Client[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase.from('clients').select('*');
    if (error || !data || data.length === 0) {
      console.log("Using mock client data", error);
      // Fallback to mock data if not available
      return mockClients;
    }
    return data as Client[];
  } catch (err) {
    console.error("Error fetching clients:", err);
    return mockClients;
  }
};

export const fetchJobs = async (): Promise<JobDescription[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase.from('jobs').select('*');
    if (error || !data || data.length === 0) {
      console.log("Using mock job data", error);
      // Fallback to mock data if not available
      return mockJobs;
    }
    return data as JobDescription[];
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return mockJobs;
  }
};

export const fetchClient = async (id: string): Promise<Client | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockClients.find(client => client.id === id);
};

export const createClient = async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newClient: Client = {
    id: `client-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...client
  };
  
  // In a real app, we'd send this to the API and get an ID back
  return newClient;
};

export const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const existingClient = mockClients.find(c => c.id === id);
  if (!existingClient) {
    throw new Error(`Client with ID ${id} not found`);
  }
  
  const updatedClient = {
    ...existingClient,
    ...client,
    updatedAt: new Date().toISOString()
  };
  
  // In a real app, we'd update the API
  return updatedClient;
};

export const deleteClient = async (id: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, we'd call the API to delete
  return true;
};

export const createJob = async (job: Omit<JobDescription, 'id' | 'clientId'>): Promise<JobDescription> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newJob: JobDescription = {
    id: `job-${Date.now()}`,
    clientId: "1", // Default to first client for now
    ...job
  };
  
  try {
    // Try to save to Supabase
    const { data, error } = await supabase.from('jobs').insert([newJob]).select().single();
    
    if (error) {
      console.log("Using mock job creation", error);
      // If Supabase fails, just return the new job
      return newJob;
    }
    
    return data as JobDescription;
  } catch (err) {
    console.error("Error creating job:", err);
    // Fallback to returning the new job
    return newJob;
  }
};
