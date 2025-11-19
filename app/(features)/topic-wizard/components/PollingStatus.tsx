"use client";

import { memo } from 'react';
import { Card, CardBody, Spinner, Chip } from '@heroui/react';
import { useWizardContext } from '../context/WizardContext';
import { PollingState } from '@/app/types/topic.types';
import { INFO_MESSAGES } from '@/app/lib/constants';

/**
 * 轮询状态组件
 */
export const PollingStatus = memo(function PollingStatus() {
  const { state } = useWizardContext();

  const getStatusText = () => {
    switch (state.pollingState) {
      case PollingState.CHECKING_STATUS:
        return INFO_MESSAGES.CHECKING_STATUS;
      case PollingState.POLLING_RESULTS:
        return INFO_MESSAGES.POLLING_RESULTS;
      case PollingState.FINISHED:
        return '查询完成';
      case PollingState.ERROR:
        return '轮询出错';
      default:
        return '';
    }
  };

  // 判断是否需要显示 loading 动画
  const isLoading = state.pollingState === PollingState.CHECKING_STATUS || 
                   state.pollingState === PollingState.POLLING_RESULTS;
  
  // 成功状态
  const isSuccess = state.pollingState === PollingState.FINISHED;

  // 如果已完成，使用极简样式，不抢占视觉焦点
  if (isSuccess) {
    return (
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 animate-in fade-in duration-500">
        <span className="text-success">✓</span>
        <span>{getStatusText()}</span>
        <span>·</span>
        <span>共获取 {state.topicResults.length} 条结果</span>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <Card className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 shadow-sm">
        <CardBody className="py-3 px-4">
          <div className="flex items-center gap-3">
            {isLoading ? (
              <Spinner size="sm" color="primary" />
            ) : (
              <div className="text-danger text-lg">⚠️</div>
            )}
            
            <div className="flex-1 flex items-center gap-2 flex-wrap">
              <p className="font-medium text-sm text-gray-700 dark:text-gray-200">
                {getStatusText()}
              </p>
              <span className="text-xs text-gray-400">
                (第 {state.attemptCount} 次查询)
              </span>
            </div>
          </div>
          {state.pollingError && (
            <div className="mt-2">
              <span className="text-xs text-danger">
                {state.pollingError}
              </span>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
});
