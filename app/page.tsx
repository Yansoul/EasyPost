"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  Spinner,
  Progress,
  Chip,
  Divider,
  Textarea,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

type Industry = {
  id: string;
  name: string;
};

type Niche = {
  id: string;
  name: string;
  description?: string;
};

const steps = ["选择行业", "选择赛道", "输入文案(可选)", "完成配置"];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedNiche, setSelectedNiche] = useState<string>("");
  const [contentScripts, setContentScripts] = useState<string[]>(["", "", ""]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [niches, setNiches] = useState<Niche[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // 初始加载行业数据，不显示 loading
    loadIndustries();
  }, []);


  // 初始加载行业列表（无 loading 状态）
  const loadIndustries = async () => {
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const mockIndustries: Industry[] = [
        { id: "life", name: "生活" },
        { id: "food", name: "美食" },
        { id: "travel", name: "旅行" },
        { id: "tech", name: "科技" },
        { id: "fashion", name: "时尚" },
        { id: "education", name: "教育" },
        { id: "finance", name: "财经" },
        { id: "health", name: "健康" },
        { id: "entertainment", name: "娱乐" },
        { id: "sports", name: "体育" },
      ];
      setIndustries(mockIndustries);
    } catch (err) {
      setError("获取行业数据失败，请稍后重试");
    }
  };

  // 模拟接口：根据行业获取细分赛道
  const fetchNiches = async (industryId: string) => {
    setLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const nicheMap: Record<string, Niche[]> = {
        life: [
          { id: "daily", name: "日常生活", description: "记录日常生活点滴" },
          { id: "home", name: "家居生活", description: "家居装修、收纳整理" },
          { id: "relationship", name: "人际关系", description: "情感、人际关系建议" },
          { id: "parenting", name: "育儿经验", description: "育儿知识、经验分享" },
        ],
        food: [
          { id: "cooking", name: "烹饪教程", description: "各类菜品制作教程" },
          { id: "baking", name: "烘焙甜点", description: "蛋糕、面包烘焙" },
          { id: "street", name: "街头美食", description: "街头小吃、探店" },
          { id: "diet", name: "健康饮食", description: "营养搭配、轻食" },
          { id: "drinks", name: "饮品调制", description: "咖啡、奶茶、调酒" },
        ],
        travel: [
          { id: "domestic", name: "国内游", description: "国内旅游景点攻略" },
          { id: "abroad", name: "出境游", description: "海外旅行攻略" },
          { id: "budget", name: "穷游攻略", description: "经济实惠的旅行方式" },
          { id: "luxury", name: "奢华游", description: "高端旅行体验" },
          { id: "backpack", name: "背包客", description: "自由行、背包旅行" },
        ],
        tech: [
          { id: "review", name: "产品评测", description: "电子产品评测体验" },
          { id: "tutorial", name: "技术教程", description: "编程、软件教程" },
          { id: "news", name: "科技资讯", description: "最新科技动态" },
          { id: "ai", name: "人工智能", description: "AI技术、应用分享" },
          { id: "gadget", name: "数码产品", description: "数码产品开箱体验" },
        ],
        fashion: [
          { id: "outfit", name: "穿搭分享", description: "日常穿搭、搭配技巧" },
          { id: "makeup", name: "美妆教程", description: "化妆技巧、产品测评" },
          { id: "shopping", name: "购物攻略", description: "购物分享、好物推荐" },
          { id: "luxury", name: "奢侈品", description: "奢侈品开箱、评测" },
        ],
        education: [
          { id: "language", name: "语言学习", description: "英语学习、外语教程" },
          { id: "exam", name: "考试攻略", description: "各类考试备考经验" },
          { id: "skill", name: "技能提升", description: "职业技能、考证经验" },
          { id: "kid", name: "儿童教育", description: "儿童学习、早教" },
        ],
        finance: [
          { id: "investment", name: "投资理财", description: "股票、基金投资" },
          { id: "crypto", name: "加密货币", description: "数字货币、区块链" },
          { id: "saving", name: "省钱攻略", description: "理财、省钱技巧" },
          { id: "property", name: "房产投资", description: "买房、房产知识" },
        ],
        health: [
          { id: "fitness", name: "健身训练", description: "健身教程、训练计划" },
          { id: "yoga", name: "瑜伽冥想", description: "瑜伽教程、冥想" },
          { id: "nutrition", name: "营养搭配", description: "营养知识、食谱" },
          { id: "mental", name: "心理健康", description: "心理调适、情绪管理" },
        ],
        entertainment: [
          { id: "movie", name: "电影解说", description: "电影推荐、解说" },
          { id: "music", name: "音乐推荐", description: "音乐分享、推荐" },
          { id: "celebrity", name: "明星八卦", description: "娱乐圈资讯" },
          { id: "game", name: "游戏攻略", description: "游戏解说、攻略" },
        ],
        sports: [
          { id: "fitness", name: "健身训练", description: "力量训练、有氧运动" },
          { id: "basketball", name: "篮球技巧", description: "篮球教学、比赛" },
          { id: "soccer", name: "足球资讯", description: "足球新闻、战术分析" },
          { id: "outdoor", name: "户外运动", description: "登山、骑行、徒步" },
        ],
      };

      setNiches(nicheMap[industryId] || []);
    } catch (err) {
      setError("获取赛道数据失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedIndustry) {
        setError("请先选择一个行业");
        return;
      }
      fetchNiches(selectedIndustry);
      setCurrentStep(2);
      setError("");
    } else if (currentStep === 2) {
      if (!selectedNiche) {
        setError("请先选择一个赛道");
        return;
      }
      setCurrentStep(3);
      setError("");
    } else if (currentStep === 3) {
      setCurrentStep(4);
      setError("");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const handleComplete = () => {
    console.log("用户选择:", {
      industry: selectedIndustry,
      niche: selectedNiche,
    });
  };

  const getIndustryName = (id: string) => {
    return industries.find((i) => i.id === id)?.name || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 顶部标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            AI 自媒体选题助手
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            智能分析您的领域，提供优质选题建议
          </p>
        </motion.div>

        {/* 步骤指示器 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <Progress
            value={(currentStep / steps.length) * 100}
            className="max-w-md mx-auto"
            size="sm"
            color="success"
          />
          <div className="flex justify-center mt-4 space-x-6">
            {steps.map((step, index) => {
              const isActive = currentStep >= index + 1;
              const isOptional = step.includes("(可选)");
              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isActive
                        ? "bg-success text-white shadow-lg shadow-success-500/30"
                        : "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className={`text-xs mt-2 text-center font-medium max-w-20 ${
                    isActive ? "text-success dark:text-success-400" : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {step}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 主要内容 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="w-full max-w-2xl mx-auto">
              {loading && (
                <div className="py-8 flex justify-center">
                  <Spinner size="lg" color="primary" />
                </div>
              )}

              {!loading && currentStep === 1 && (
                <>
                  <CardHeader className="flex flex-col items-start">
                    <h2 className="text-2xl font-bold">第一步：选择您的行业领域</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      请选择您的自媒体账号所属的行业领域
                    </p>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    {error && (
                      <div className="mb-4">
                        <Chip color="danger" variant="solid">
                          {error}
                        </Chip>
                      </div>
                    )}
                    <Select
                      label="选择行业领域"
                      placeholder="请选择一个行业"
                      selectedKeys={selectedIndustry ? [selectedIndustry] : []}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      size="lg"
                      className="w-full"
                    >
                      {industries.map((industry) => (
                        <SelectItem key={industry.id} textValue={industry.name}>
                          <div className="py-1">
                            <span className="text-base font-medium text-gray-900 dark:text-gray-100">{industry.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                    <div className="flex justify-end mt-6">
                      <Button
                        color="success"
                        size="lg"
                        onPress={handleNextStep}
                        className="w-full sm:w-auto bg-success text-white"
                      >
                        下一步
                      </Button>
                    </div>
                  </CardBody>
                </>
              )}

              {!loading && currentStep === 2 && (
                <>
                  <CardHeader className="flex flex-col items-start">
                    <h2 className="text-2xl font-bold">第二步：选择细分赛道</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      已选择行业：{getIndustryName(selectedIndustry)}
                    </p>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    {error && (
                      <div className="mb-4">
                        <Chip color="danger" variant="solid">
                          {error}
                        </Chip>
                      </div>
                    )}
                    <Select
                      label="选择细分赛道"
                      placeholder="请选择一个赛道"
                      selectedKeys={selectedNiche ? [selectedNiche] : []}
                      onChange={(e) => setSelectedNiche(e.target.value)}
                      size="lg"
                      className="w-full"
                    >
                      {niches.map((niche) => (
                        <SelectItem key={niche.id} textValue={niche.name}>
                          <div className="flex flex-col gap-1 py-1">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{niche.name}</span>
                            {niche.description && (
                              <span className="text-sm text-gray-600 dark:text-gray-400">{niche.description}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                    <div className="flex justify-between mt-6 gap-4">
                      <Button
                        variant="bordered"
                        size="lg"
                        onPress={handlePreviousStep}
                        className="w-full sm:w-auto"
                      >
                        返回
                      </Button>
                      <Button
                        color="success"
                        size="lg"
                        onPress={handleNextStep}
                        className="w-full sm:w-auto text-white"
                      >
                        下一步
                      </Button>
                    </div>
                  </CardBody>
                </>
              )}

              {!loading && currentStep === 3 && (
                <>
                  <CardHeader className="flex flex-col items-start">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold">输入历史视频文案词稿（可选）</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      提供您已发布的视频文案词稿，AI 将学习您的风格和特点，生成更符合您账号风格的选题建议
                    </p>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    {error && (
                      <div className="mb-4">
                        <Chip color="danger" variant="solid">
                          {error}
                        </Chip>
                      </div>
                    )}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400">请复制您已发布视频的代表性文案：</p>
                        <Button
                          size="sm"
                          color="success"
                          variant="flat"
                          onPress={() => {
                            if (contentScripts.length < 10) {
                              setContentScripts([...contentScripts, ""]);
                            }
                          }}
                          isDisabled={contentScripts.length >= 10}
                        >
                          + 添加文案
                        </Button>
                      </div>
                      {contentScripts.map((script, index) => (
                        <div key={index} className="relative">
                          <Textarea
                            label={`文案词稿 ${index + 1}（${script.length}/500）`}
                            placeholder="请输入视频文案内容..."
                            value={script}
                            onValueChange={(value) => {
                              const newScripts = [...contentScripts];
                              newScripts[index] = value.slice(0, 500);
                              setContentScripts(newScripts);
                            }}
                            maxLength={500}
                            minRows={4}
                            maxRows={8}
                            className="w-full"
                          />
                          {contentScripts.length > 1 && (
                            <button
                              onClick={() => {
                                const newScripts = contentScripts.filter((_, i) => i !== index);
                                setContentScripts(newScripts);
                              }}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-all opacity-60 hover:opacity-100"
                              title="删除此文案"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                        <p className="text-sm text-emerald-700 dark:text-emerald-400">
                          <span className="font-semibold">💡 小贴士：</span>
                          选择最能代表您账号风格的文案，包含开头钩子、中间内容和结尾引导语，这样 AI 能更好地学习您的独特风格
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between mt-6 gap-4">
                      <Button
                        variant="bordered"
                        size="lg"
                        onPress={handlePreviousStep}
                        className="w-full sm:w-auto"
                      >
                        返回
                      </Button>
                      <Button
                        variant="light"
                        size="lg"
                        onPress={() => {
                          setContentScripts(["", "", ""]);
                          handleNextStep();
                        }}
                        className="w-full sm:w-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        跳过此步骤
                      </Button>
                      <Button
                        color="success"
                        size="lg"
                        onPress={handleNextStep}
                        className="w-full sm:w-auto text-white"
                      >
                        继续
                      </Button>
                    </div>
                  </CardBody>
                </>
              )}

              {!loading && currentStep === 4 && (
                <>
                  <CardHeader className="flex flex-col items-start">
                    <h2 className="text-2xl font-bold">配置完成！</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      您已完成领域选择，可以开始获取选题建议了
                    </p>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">行业领域</p>
                          <p className="font-medium">{getIndustryName(selectedIndustry)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">细分赛道</p>
                          <p className="font-medium">
                            {niches.find((n) => n.id === selectedNiche)?.name}
                          </p>
                        </div>
                        {contentScripts.some(s => s.trim()) && (
                          <div className="sm:col-span-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">已提供文案样本</p>
                            <p className="font-medium text-success">{contentScripts.filter(s => s.trim()).length} 个</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="bordered"
                        size="lg"
                        onPress={handlePreviousStep}
                        className="w-full sm:w-auto"
                      >
                        返回修改
                      </Button>
                      <Button
                        color="success"
                        size="lg"
                        onPress={handleComplete}
                        className="w-full sm:w-auto text-white"
                      >
                        获取选题建议
                      </Button>
                    </div>
                  </CardBody>
                </>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
