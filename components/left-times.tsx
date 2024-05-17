export default function LeftTimes({
  className,
  remainingTimes,
  totalTimes,
}: {
  className?: string;
  remainingTimes: number | string | undefined;
  totalTimes: number | string | undefined;
}) {
  return (
    <div className={className}>
      今天还能免费进行 <span className="text-orange-600">{remainingTimes}</span> /{' '}
      {totalTimes} 次解读
    </div>
  );
}
