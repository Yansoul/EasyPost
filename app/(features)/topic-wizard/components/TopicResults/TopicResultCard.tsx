"use client";

import { memo } from 'react';
import { Card, CardBody, Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { FeishuTopicResult } from '@/app/types/topic.types';
import { ResultScoreBadge } from './ResultScoreBadge';

interface TopicResultCardProps {
  result: FeishuTopicResult;
  index: number;
  onClick: (result: FeishuTopicResult) => void;
}

/**
 * 选题结果卡片组件 - 网格精简版
 */
export const TopicResultCard = memo(function TopicResultCard({
  result,
  index,
  onClick,
}: TopicResultCardProps) {
  const { fields } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
      className="h-full"
    >
      <Card 
        isPressable
        onPress={() => onClick(result)}
        className="w-full h-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200"
      >
        <CardBody className="p-5 flex flex-col gap-4 h-full justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start gap-2">
              <ResultScoreBadge score={fields.match_score || ''} />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-3">
              {fields.title || '未命名选题'}
            </h3>
          </div>

          <div className="flex items-center justify-between mt-auto pt-2">
            {fields.created_at && (
              <span className="text-xs text-gray-400 font-mono">
                {new Date(fields.created_at).toLocaleDateString('zh-CN')}
              </span>
            )}
            <Button 
              size="sm" 
              variant="light" 
              onPress={() => onClick(result)}
              className="text-gray-500 font-medium px-2 h-8 min-w-16"
            >
              查看详情
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
});
