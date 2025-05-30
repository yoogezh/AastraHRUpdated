// src/store/actions/CandidateActions.js
import { getAllCandidates, addCandidate, updateCandidate } from '../../client/Api/FormApi';

export const SET_ALL_CANDIDATES = 'SET_ALL_CANDIDATES';
export const ADD_CANDIDATE = 'ADD_CANDIDATE';
export const UPDATE_CANDIDATE = 'UPDATE_CANDIDATE';

export const fetchAllCandidates = () => {
  return async (dispatch) => {
    try {
      const response = await getAllCandidates();
      dispatch({
        type: SET_ALL_CANDIDATES,
        payload: response.data
      });
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    }
  };
};

export const createCandidate = (candidateData) => {
  return async (dispatch) => {
    try {
      const response = await addCandidate(candidateData);
      dispatch({
        type: ADD_CANDIDATE,
        payload: response.data
      });
      return response; // Return response for handling in component
    } catch (error) {
      console.error('Failed to add candidate', error);
      throw error; // Re-throw to handle in component
    }
  };
};

export const editCandidate = (candidateId, candidateData) => {
  return async (dispatch) => {
    try {
      const response = await updateCandidate(candidateId, candidateData);
      dispatch({
        type: UPDATE_CANDIDATE,
        payload: { id: candidateId, data: response.data }
      });
      return response; // Return response for handling in component
    } catch (error) {
      console.error('Failed to update candidate', error);
      throw error; // Re-throw to handle in component
    }
  };
};