import { useEffect } from 'react';

/**
 * 自定义 Hook：在用户尝试离开页面时显示警告
 * @param shouldWarn - 是否应该显示警告（true 时启用警告）
 */
export function useBeforeUnload(shouldWarn: boolean) {
  useEffect(() => {
    if (!shouldWarn) {
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldWarn]);
}

