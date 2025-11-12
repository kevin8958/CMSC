import {
  TbCircleDashed,
  TbDotsCircleHorizontal,
  TbProgress,
  TbCircleDashedCheck,
  TbCircleCheck,
} from "react-icons/tb";

export const STATUS_CONFIG = {
  backlog: {
    label: "백로그",
    color: "bg-gray-200 text-gray-800",
    icon: <TbCircleDashed className="text-base text-gray-800" />,
  },
  todo: {
    label: "할 일",
    color: "bg-third-200 text-third-800",
    icon: <TbDotsCircleHorizontal className="text-base text-third-800" />,
  },
  in_progress: {
    label: "진행중",
    color: "bg-yellow-200 text-yellow-800",
    icon: <TbProgress className="text-base text-yellow-800" />,
  },
  review: {
    label: "리뷰",
    color: "bg-purple-200 text-purple-800",
    icon: <TbCircleDashedCheck className="text-base text-purple-800" />,
  },
  done: {
    label: "완료",
    color: "bg-green-200 text-green-800",
    icon: <TbCircleCheck className="text-base text-green-800" />,
  },
} as const;

export const PRIORITY_CONFIG = {
  low: {
    label: "낮음",
    color: "bg-green-200 text-green-800",
  },
  medium: {
    label: "보통",
    color: "bg-yellow-200 text-yellow-800",
  },
  high: {
    label: "높음",
    color: "bg-red-200 text-red-800",
  },
} as const;
