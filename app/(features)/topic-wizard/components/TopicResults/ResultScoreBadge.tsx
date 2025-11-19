"use client";

import { memo } from 'react';
import { CircularProgress, Tooltip } from '@heroui/react';
import { SCORE_THRESHOLDS } from '@/app/lib/constants';

interface ResultScoreBadgeProps {
  score: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

/**
 * 获取分数对应的颜色状态
 */
function getScoreColor(scoreVal: number): "success" | "primary" | "warning" | "danger" | "default" {
  if (scoreVal >= SCORE_THRESHOLDS.EXCELLENT) {
    return "success"; // >= 90
  }
  if (scoreVal >= SCORE_THRESHOLDS.GOOD) {
    return "primary"; // >= 80
  }
  if (scoreVal >= SCORE_THRESHOLDS.FAIR) {
    return "warning"; // >= 70
  }
  return "default"; // < 70
}

/**
 * 分数徽章组件 - 环形进度条风格
 */
export const ResultScoreBadge = memo(function ResultScoreBadge({
  score,
  size = "md",
  showLabel = true
}: ResultScoreBadgeProps) {
  if (!score) return null;

  // 解析分数 (处理 "8.5/10" 或 "8.5" 格式)
  const scoreNum = parseFloat(score.split('/')[0]);
  const percentage = scoreNum * 10; // 假设满分是10分，转为百分比

  const color = getScoreColor(percentage);

  // 根据尺寸调整样式
  const sizeConfig = {
    sm: { class: "w-8 h-8", text: "text-[10px]", labelSize: "text-[8px]" },
    md: { class: "w-12 h-12", text: "text-sm", labelSize: "text-[10px]" },
    lg: { class: "w-16 h-16", text: "text-lg", labelSize: "text-xs" },
  };

  const currentSize = sizeConfig[size];

  return (
    <Tooltip content="AI 契合度评分 (满分10分)">
      <div className="flex flex-col items-center gap-1 cursor-help">
        <CircularProgress
          classNames={{
            svg: currentSize.class,
            indicator: "stroke-[3px]",
            track: "stroke-[3px] stroke-default-100",
            value: `${currentSize.text} font-bold ${color === 'default' ? 'text-gray-500' : ''}`,
          }}
          value={percentage}
          color={color}
          showValueLabel={true}
          formatOptions={{ style: "decimal" }} // 只显示数字，不显示百分号
          valueLabel={scoreNum.toString()} // 直接显示原始分数 (例如 8.5)
          aria-label={`匹配度 ${scoreNum}`}
        />
        {showLabel && (
          <span className={`${currentSize.labelSize} font-medium text-gray-500 dark:text-gray-400 leading-none`}>
            契合度
          </span>
        )}
      </div>
    </Tooltip>
  );
});
