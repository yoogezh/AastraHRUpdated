
import { supabase } from './supabase';
import { Interview, InterviewReport, InterviewStatus } from '@/types';

export const fetchInterviews = async () => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .order('interviewDate', { ascending: false });

    if (error) throw error;
    return data as Interview[];
  } catch (error) {
    console.error('Error fetching interviews:', error);
    throw error;
  }
};

export const fetchInterviewsByFilter = async (filters: Record<string, any>) => {
  try {
    let query = supabase.from('interviews').select('*');

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'startDate') {
          query = query.gte('interviewDate', value);
        } else if (key === 'endDate') {
          query = query.lte('interviewDate', value);
        } else if (key === 'candidateName' || key === 'interviewerName') {
          query = query.ilike(key, `%${value}%`);
        } else {
          query = query.eq(key, value);
        }
      }
    });

    query = query.order('interviewDate', { ascending: false });
    const { data, error } = await query;

    if (error) throw error;
    return data as Interview[];
  } catch (error) {
    console.error('Error fetching filtered interviews:', error);
    throw error;
  }
};

export const createInterview = async (interview: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .insert({
        ...interview,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select();

    if (error) throw error;
    return data[0] as Interview;
  } catch (error) {
    console.error('Error creating interview:', error);
    throw error;
  }
};

export const updateInterview = async (id: string, interview: Partial<Interview>) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .update({
        ...interview,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0] as Interview;
  } catch (error) {
    console.error('Error updating interview:', error);
    throw error;
  }
};

export const deleteInterview = async (id: string) => {
  try {
    const { error } = await supabase.from('interviews').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting interview:', error);
    throw error;
  }
};

export const fetchInterviewReports = async () => {
  try {
    const { data: interviews, error } = await supabase
      .from('interviews')
      .select('*')
      .order('interviewDate', { ascending: false });

    if (error) throw error;

    // Group by interviewer
    const reportsByInterviewer: Record<string, InterviewReport> = {};
    
    interviews.forEach((interview: Interview) => {
      if (!reportsByInterviewer[interview.interviewerName]) {
        reportsByInterviewer[interview.interviewerName] = {
          employeeName: interview.interviewerName,
          totalInterviews: 0,
          statusCounts: {} as Record<InterviewStatus, number>,
          candidates: [],
        };
      }
      
      // Increment total interviews
      reportsByInterviewer[interview.interviewerName].totalInterviews++;
      
      // Increment status counts
      if (!reportsByInterviewer[interview.interviewerName].statusCounts[interview.status]) {
        reportsByInterviewer[interview.interviewerName].statusCounts[interview.status] = 0;
      }
      reportsByInterviewer[interview.interviewerName].statusCounts[interview.status]++;
      
      // Add candidate to the list
      reportsByInterviewer[interview.interviewerName].candidates.push({
        id: interview.id,
        name: interview.candidateName,
        status: interview.status,
        interviewDate: interview.interviewDate,
      });
    });
    
    return Object.values(reportsByInterviewer);
  } catch (error) {
    console.error('Error fetching interview reports:', error);
    throw error;
  }
};
