"use client";

import { useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@heroui/react';
import { WizardProvider } from './context/WizardProvider';
import { useWizardContext } from './context/WizardContext';
import { WizardStepper } from './components/WizardStepper';
import { IndustrySelectStep } from './components/steps/IndustrySelectStep';
import { NicheSelectStep } from './components/steps/NicheSelectStep';
import { ContentScriptsStep } from './components/steps/ContentScriptsStep';
import { SummaryStep } from './components/steps/SummaryStep';
import { LoadingSpinner } from '@/app/components/common/LoadingSpinner';
import { ErrorBoundary } from '@/app/components/common/ErrorBoundary';
import { useBeforeUnload } from '@/app/hooks/useBeforeUnload';
import { fetchCategories } from '@/app/services/api/categories.api';
import { logger } from '@/app/lib/logger';

/**
 * 向导内容组件
 */
const WizardContent = memo(function WizardContent() {
  const { state, actions } = useWizardContext();

  // 从第3步开始启用离开页面警告
  useBeforeUnload(state.currentStep >= 3);

  // 页面加载时获取分类数据
  useEffect(() => {
    const loadData = async () => {
      try {
        actions.setLoading(true);
        logger.info('加载分类数据');
        const data = await fetchCategories();
        actions.setIndustries(data.industry || []);
        actions.setCategoryData(data.niches || {});
        logger.info('分类数据加载完成');
      } catch (error) {
        logger.error('加载分类数据失败', error);
        actions.setError('加载分类数据失败，请刷新页面重试');
      } finally {
        actions.setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 渲染当前步骤
  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <IndustrySelectStep />;
      case 2:
        return <NicheSelectStep />;
      case 3:
        return <ContentScriptsStep />;
      case 4:
        return <SummaryStep />;
      default:
        return null;
    }
  };

  // 是否显示宽屏模式（当有结果展示时）
  const isWideMode = state.topicResults.length > 0 && state.currentStep === 4;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className={`mx-auto transition-all duration-500 ${isWideMode ? 'max-w-7xl' : 'max-w-3xl'}`}>
        {/* 顶部标题 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
            AI 自媒体选题助手
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            智能分析您的领域，提供优质选题建议
          </p>
        </motion.div>

        {/* 步骤指示器 */}
        <div className="mb-16">
          <WizardStepper currentStep={state.currentStep} />
        </div>

        {/* 主要内容 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* 卡片包裹 */}
            <Card className="w-full mx-auto bg-white dark:bg-gray-950 rounded-2xl shadow-sm border border-stone-200/50 dark:border-gray-800 overflow-hidden">
              {state.loading ? (
                <div className="py-12 flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                renderStep()
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});

/**
 * 向导主容器组件
 * 包含 Provider 和内容，带有局部错误边界
 */
export default function TopicWizardContainer() {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 p-4">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              应用遇到问题
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              请刷新页面重试。如果问题持续存在，请联系支持。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-md hover:opacity-90 transition-opacity font-medium text-sm"
            >
              刷新页面
            </button>
          </div>
        </div>
      }
    >
      <WizardProvider>
        <WizardContent />
      </WizardProvider>
    </ErrorBoundary>
  );
}
