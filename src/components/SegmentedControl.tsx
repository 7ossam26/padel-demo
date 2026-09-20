type Option<T extends string> = { value: T; label: string };

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  label?: string;
}) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          className={value === option.value ? "selected" : ""}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
