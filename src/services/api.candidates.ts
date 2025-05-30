
import { Candidate } from "@/types";
import { supabase } from './supabase';

// Mock data for candidates
const mockCandidates: Candidate[] = [
  {
    id: "1",
    candidateName: "John Smith",
    clientName: "Tech Solutions Inc",
    overallExp: 7,
    relevantExp: 5,
    currentLocation: "San Francisco, CA",
    candidatePreferredLocation: true,
    qualification: "Master's in Computer Science",
    noticePeriod: "30 days",
    currentlyServingNotice: false,
    currentlyHoldingOffer: false,
    expCTC: 130000,
    currentCTC: 110000,
    status: "Excellent",
    mobileNo: "123-456-7890",
    emailId: "john.smith@example.com",
    shortlistedBy: "Sarah Johnson",
    primarySkills: ["React", "TypeScript", "Node.js"],
    secondarySkills: ["GraphQL", "MongoDB"]
  },
  {
    id: "2",
    candidateName: "Emily Johnson",
    clientName: "Global Finance Ltd",
    overallExp: 5,
    relevantExp: 3,
    currentLocation: "New York, NY",
    candidatePreferredLocation: false,
    qualification: "Bachelor's in Information Technology",
    noticePeriod: "60 days",
    currentlyServingNotice: true,
    currentlyHoldingOffer: true,
    currentOfferValue: "120000",
    expCTC: 125000,
    currentCTC: 95000,
    status: "Ok to Proceed",
    mobileNo: "987-654-3210",
    whatsAppNo: "987-654-3210",
    emailId: "emily.johnson@example.com",
    shortlistedBy: "David Wilson",
    remarks: "Strong technical skills, good communication",
    primarySkills: ["Java", "Spring Boot", "Microservices"],
    secondarySkills: ["Docker", "Kubernetes"]
  }
];

export const fetchCandidates = async (): Promise<Candidate[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase.from('candidates').select('*');
    if (error || !data || data.length === 0) {
      console.log("Using mock candidate data", error);
      // Fallback to mock data if not available
      return mockCandidates;
    }
    return data as Candidate[];
  } catch (err) {
    console.error("Error fetching candidates:", err);
    return mockCandidates;
  }
};

export const createCandidate = async (candidate: Omit<Candidate, 'id'>): Promise<Candidate> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newCandidate: Candidate = {
    id: `candidate-${Date.now()}`,
    ...candidate
  };
  
  try {
    // Try to save to Supabase
    const { data, error } = await supabase.from('candidates').insert([newCandidate]).select().single();
    
    if (error) {
      console.log("Using mock candidate creation", error);
      // If Supabase fails, just return the new candidate
      return newCandidate;
    }
    
    return data as Candidate;
  } catch (err) {
    console.error("Error creating candidate:", err);
    // Fallback to returning the new candidate
    return newCandidate;
  }
};

export const updateCandidate = async (id: string, candidate: Partial<Candidate>): Promise<Candidate> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const existingCandidate = mockCandidates.find(c => c.id === id);
  if (!existingCandidate) {
    throw new Error(`Candidate with ID ${id} not found`);
  }
  
  const updatedCandidate = {
    ...existingCandidate,
    ...candidate
  };
  
  try {
    // Try to update in Supabase
    const { data, error } = await supabase
      .from('candidates')
      .update(candidate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.log("Using mock candidate update", error);
      return updatedCandidate;
    }
    
    return data as Candidate;
  } catch (err) {
    console.error("Error updating candidate:", err);
    return updatedCandidate;
  }
};

export const deleteCandidate = async (id: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  try {
    // Try to delete from Supabase
    const { error } = await supabase.from('candidates').delete().eq('id', id);
    
    if (error) {
      console.log("Using mock candidate deletion", error);
    }
    
    return true;
  } catch (err) {
    console.error("Error deleting candidate:", err);
    return true;
  }
};
