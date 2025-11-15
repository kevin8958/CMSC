import { motion } from "framer-motion";
import classNames from "classnames";

interface TableSkeletonProps {
  /** 보여줄 로우 개수 */
  rows?: number;
  /** 컬럼 개수 */
  columns?: number;
  /** 각 셀 높이 */
  rowHeight?: number;
  /** radius 정도 */
  rounded?: string;
  /** 외부 className */
  classes?: string;
}

export default function TableSkeleton({
  rows = 6,
  columns = 5,
  rowHeight = 48,
  rounded = "md",
  classes,
}: TableSkeletonProps) {
  return (
    <div
      className={classNames(
        "w-full border border-gray-100 rounded-lg overflow-hidden",
        classes
      )}
    >
      {/* header skeleton */}
      <div
        className="grid bg-gray-50 border-b border-gray-100"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-[40px] border-r border-gray-100 last:border-r-0 flex items-center justify-center"
          >
            <motion.div
              className="h-[18px] w-[60%] mx-auto bg-gray-200 rounded"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
            />
          </div>
        ))}
      </div>

      {/* body skeleton */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="grid border-b border-gray-100"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, c) => (
            <div
              key={c}
              className={classNames(
                "flex items-center justify-center py-2 border-r border-gray-100 last:border-r-0"
              )}
              style={{ height: `${rowHeight}px` }}
            >
              <motion.div
                className={classNames(
                  "bg-gray-200",
                  `rounded-${rounded}`,
                  "w-[60%] h-[16px]"
                )}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: (r * columns + c) * 0.05,
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
