import axios from './axios';

export const submitRunningFeedback = async (payload: {
  user_id: number;
  rating: number;
  recommend: boolean;
  comment: string;
  completed_at: string;
}) => {
  const res = await axios.post('/api/running/feedback', payload);
  return res.data;
};

export const fetchRunningSummary = async (userId: number) => {
  const res = await axios.get('/api/running/summary', {
    params: { user_id: userId },
  });
  return res.data;
};
