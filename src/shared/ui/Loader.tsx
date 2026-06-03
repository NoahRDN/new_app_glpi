type LoaderProps = {
  label?: string;
};

export function Loader({ label = "Chargement..." }: LoaderProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <span className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}