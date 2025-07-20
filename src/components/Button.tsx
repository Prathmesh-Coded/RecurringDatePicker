type ButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "custom";
  "aria-describedby"?: string;
  "aria-label"?: string;
  disabled?: boolean;
};

const Button = ({
  label,
  onClick,
  className = "",
  variant = "primary",
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
  disabled = false,
}: ButtonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-black text-white hover:bg-gray-900";
      case "secondary":
        return "bg-gray-600 text-white hover:bg-gray-700";
      case "outline":
        return "bg-white text-black border border-black hover:bg-gray-50";
      case "custom":
        return "";
      default:
        return "bg-black text-white hover:bg-gray-800";
    }
  };

  return (
    <button
      className={`px-4 py-2 rounded-md transition-colors duration-200 min-w-[100px] ${getVariantClasses()} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
