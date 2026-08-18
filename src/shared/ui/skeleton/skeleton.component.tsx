interface SkeletonProps {
  width?: string | number
  height?: string | number
  radius?: string | number
  className?: string
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  radius = '6px',
  className,
}: SkeletonProps) {
  return (
    <span
      className={['skeleton', className].filter(Boolean).join(' ')}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  )
}
