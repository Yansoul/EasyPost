"use client";

import { memo, useState, useMemo } from "react";
import {
  Chip,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import { FeishuTopicResult } from "@/app/types/topic.types";
import { TopicResultCard } from "./TopicResultCard";
import { TopicResultDetail } from "./TopicResultDetail";

interface TopicResultsListProps {
  results: FeishuTopicResult[];
}

type SortOption = "score_desc" | "score_asc" | "newest";

/**
 * 选题结果列表组件 - 网格布局 + 弹窗详情
 */
export const TopicResultsList = memo(function TopicResultsList({
  results,
}: TopicResultsListProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedResult, setSelectedResult] =
    useState<FeishuTopicResult | null>(null);
  const [sortType, setSortType] = useState<SortOption>("score_desc");

  // 排序逻辑
  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      if (sortType === "newest") {
        return (b.fields.created_at || 0) - (a.fields.created_at || 0);
      }

      // 解析分数 "8.5/10" -> 8.5
      const getScore = (res: FeishuTopicResult) => {
        const scoreStr = res.fields.match_score?.split("/")[0] || "0";
        return parseFloat(scoreStr);
      };

      const scoreA = getScore(a);
      const scoreB = getScore(b);

      if (sortType === "score_asc") {
        return scoreA - scoreB;
      }
      return scoreB - scoreA; // score_desc
    });
  }, [results, sortType]);

  const handleCardClick = (result: FeishuTopicResult) => {
    setSelectedResult(result);
    onOpen();
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            📝 选题结果
          </h3>
          <Chip color="success" variant="flat" size="sm">
            共 {results.length} 条
          </Chip>
        </div>

        <div className="w-full sm:w-48">
          <Select
            label="排序方式"
            size="sm"
            selectedKeys={[sortType]}
            onChange={(e) => setSortType(e.target.value as SortOption)}
            className="max-w-xs"
          >
            <SelectItem key="score_desc">匹配度: 从高到低</SelectItem>
            <SelectItem key="score_asc">匹配度: 从低到高</SelectItem>
            <SelectItem key="newest">最新生成</SelectItem>
          </Select>
        </div>
      </div>

      {/* 网格布局 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedResults.map((result, index) => (
          <TopicResultCard
            key={result.record_id}
            result={result}
            index={index}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {/* 详情弹窗 */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
        backdrop="blur"
        className="dark:bg-gray-950"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-6 sm:p-8">
                {selectedResult && (
                  <TopicResultDetail result={selectedResult} />
                )}
              </ModalBody>
              <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <Button color="primary" variant="light" onPress={onClose}>
                  关闭
                </Button>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
});
