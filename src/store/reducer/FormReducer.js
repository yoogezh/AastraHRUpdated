// src/store/reducers/CandidateReducer.js
import {
  SET_ALL_CANDIDATES,
  ADD_CANDIDATE,
  UPDATE_CANDIDATE
} from '../action/FormAction';

const initialState = {
  candidates: [],
  loading: false,
  error: null
};

const CandidateReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_CANDIDATES:
      return {
        ...state,
        candidates: action.payload.candidates,
        loading: false
      };

    case ADD_CANDIDATE:
      return {
        ...state,
        candidates: [...state.candidates, action.payload],
        loading: false
      };
      
    case UPDATE_CANDIDATE:
      return {
        ...state,
        candidates: state.candidates.map(candidate => 
          candidate.candidateId === action.payload.id
            ? { ...candidate, ...action.payload.data }
            : candidate
        ),
        loading: false
      };

    default:
      return state;
  }
};

export default CandidateReducer;    