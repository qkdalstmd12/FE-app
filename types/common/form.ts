// 필드 상태 정의
export interface FieldState {
  status: boolean;
  message: string;
  value: any | any[];
}
export type FormStates<T extends string> = {
  [K in T]: FieldState;
};
export const defaultFieldState: FieldState = {
  value: '',
  status: true,
  message: '',
};
// 키 배열 입력에 따른 초기화 함수
export const getDefaultStates = <T extends string>(fields: T[]): Record<T, FieldState> => {
  return fields.reduce(
    (acc, field) => {
      acc[field] = { ...defaultFieldState };
      return acc;
    },
    {} as Record<T, FieldState>,
  );
};
