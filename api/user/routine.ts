import axios from 'axios';

// 루틴 생성
export const createRoutine = async (routine: { place: string; destination: string; time: string; day: string[] }) => {
  try {
    const response = await axios.post('/api/routines-create', routine);
    return response.data;
  } catch (error: any) {
    console.error('루틴 생성 실패:', error.response?.data || error.message);
    throw error.response?.data || { message: '루틴 생성 실패' };
  }
};

// 루틴 수정
export const updateRoutine = async (
  routineId: number,
  routine: {
    place: 'COMPANY' | 'GYM' | 'SCHOOL' | 'HOME' | 'ETC';
    destination: string;
    time: string;
    day: string[];
  },
) => {
  try {
    const response = await axios.put(`/api/routines-update/${routineId}`, routine);
    return response.data;
  } catch (error: any) {
    console.error('루틴 수정 실패:', error.response?.data || error.message);
    throw error.response?.data || { message: '루틴 수정 실패' };
  }
};

// 루틴 목록 조회
export const getRoutineList = async () => {
  try {
    const response = await axios.get('/api/routines-list', {});
    return response.data;
  } catch (error: any) {
    console.error('루틴 조회 실패:', error.response?.data || error.message);
    throw error.response?.data || { message: '루틴 조회 실패' };
  }
};

// 루틴 삭제
export const deleteRoutine = async (routineId: number) => {
  try {
    await axios.delete(`/api/routines-delete/${routineId}`);
    return { message: '루틴 삭제 성공' };
  } catch (error: any) {
    console.error('루틴 삭제 실패:', error.response?.data || error.message);
    throw error.response?.data || { message: '루틴 삭제 실패' };
  }
};
