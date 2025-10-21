import classNames from 'classnames';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  dashed?: boolean;
  color?: string;
  thickness?: string;
  className?: string;
}

const Divider = ({
  orientation = 'horizontal',
  dashed = false,
  color = 'border-gray-300/50',
  thickness,
  className,
}: DividerProps) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={classNames(
        'shrink-0',
        isHorizontal ? 'w-full' : 'h-full',
        dashed ? 'border-dashed' : 'border-solid',
        isHorizontal ? thickness || 'border-t' : thickness || 'border-l',
        color,
        className,
      )}
    />
  );
};

export default Divider;
