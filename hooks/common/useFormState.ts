// src/hooks/useFormStateManager.ts
import { useState } from 'react';
import { FormStates, getDefaultStates } from '@/types/common';

export const useFormStateManager = <T extends string>(formfields: T[]) => {
  const [states, setStates] = useState<FormStates<T>>(getDefaultStates(formfields));

  const changeStates = (field: (typeof formfields)[number], entries: [string, string | boolean | any][]) => {
    setStates((prevState) => {
      const updatedField = { ...prevState[field] };
      for (const [key, value] of entries) {
        (updatedField as any)[key] = value;
      }
      return { ...prevState, [field]: updatedField };
    });
  };

  /** 전체 초기화 함수 */
  const resetStates = () => {
    setStates(getDefaultStates(formfields));
  };

  return {
    states, // 현재 폼 상태
    changeStates, // 상태 업데이트 함수
    resetStates, // 전체 초기화 함수
    setStates, // 필요시 직접 상태 조작 가능
  };
};
