import clsx from 'clsx';
import c from './Skeleton.module.scss';

type SkeletonProps = {
  className?: string;
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  count?: number;
};

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  count = 1,
}) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className={clsx(c.skeleton, className)}
        style={{ width, height }}
        aria-hidden='true'
      />
    ))}
  </>
);
