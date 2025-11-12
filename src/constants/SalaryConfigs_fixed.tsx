import {
  TbDotsCircleHorizontal,
  TbCircleDashedCheck,
  TbCircleCheck,
} from "react-icons/tb";

export const STATUS_CONFIG = {
  pending: {
    label: "지급대기",
    color: "bg-gray-200 text-gray-800",
    icon: <TbDotsCircleHorizontal className="text-base text-gray-800" />,
  },
  reviewed: {
    label: "검토완료",
    color: "bg-third-200 text-third-800",
    icon: <TbCircleDashedCheck className="text-base text-third-800" />,
  },
  paid: {
    label: "지급완료",
    color: "bg-green-200 text-green-800",
    icon: <TbCircleCheck className="text-base text-green-800" />,
  },
} as const;
