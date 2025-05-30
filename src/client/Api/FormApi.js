// src/api/CandidateApi.js
import client from '../client';

const getAllCandidates = async () => {
  try {
    const response = await client('Candidate/GetAllCandidate', 'GET', null);
    return response;
  } catch (error) {
    console.error('Error fetching candidates', error);
    throw error;
  }
};

const addCandidate = async (formData) => {
  try {
    const response = await client(
      'Candidate/create',  
      'POST',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response;
  } catch (error) {
    console.error('Error adding candidate', error);
    throw error;
  }
};

const updateCandidate = async (candidateId, formData) => {
  try {
    const response = await client(
      `Candidate/UpdateCandidate/${candidateId}`,
      'PUT',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response;
  } catch (error) {
    console.error('Error updating candidate', error);
    throw error;
  }
};

export {
  getAllCandidates,
  addCandidate,
  updateCandidate
};