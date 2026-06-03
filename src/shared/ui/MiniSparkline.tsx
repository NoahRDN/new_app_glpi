type MiniSparklineProps = {
  color: string;
};

export function MiniSparkline({ color }: MiniSparklineProps) {
  return (
    <svg width="78" height="26" viewBox="0 0 78 26" fill="none" aria-hidden="true">
      <path
        d="M2 18C10 6 18 6 26 12C34 18 42 19 51 9C58 2 66 8 76 11"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
