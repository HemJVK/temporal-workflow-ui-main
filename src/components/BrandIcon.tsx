import { useState } from "react";
import { ICON_MAP } from "../integrations/types"; // Your existing Lucide mapping

interface BrandIconProps {
  type: string; // e.g. "tool_slack"
  iconName: string; // e.g. "MessageSquare" (Fallback)
  className?: string; // For sizing (w-5 h-5)
}

// Special mappings for slugs that don't match the type name exactly
const SLUG_EXCEPTIONS: Record<string, string> = {
  tool_google_calendar: "googlecalendar",
  tool_google_sheets: "googlesheets",
  tool_google_ads: "googleads",
  tool_meta_ads: "meta",
  tool_aws_s3: "amazonaws", // S3 usually uses the generic AWS logo
  tool_openai: "openai",
  tool_anthropic: "anthropic",
};

export const BrandIcon = ({
  type,
  iconName,
  className = "w-5 h-5",
}: BrandIconProps) => {
  const [error, setError] = useState(false);

  // 1. Check if this is a "Tool" or "Integration" that likely has a brand logo
  const isBrandedTool = type.startsWith("tool_");

  // 2. Determine the CDN Slug
  // Remove 'tool_' prefix and underscores (e.g., 'tool_google_sheets' -> 'googlesheets')
  let slug = type.replace("tool_", "").replace(/_/g, "");

  // Check exception list first
  if (SLUG_EXCEPTIONS[type]) {
    slug = SLUG_EXCEPTIONS[type];
  }

  // 3. Render
  // If it is a tool and hasn't errored, try the CDN
  if (isBrandedTool && !error) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${slug}`}
        alt={type}
        className={`${className} object-contain`}
        onError={() => setError(true)} // Fallback to Lucide if CDN fails
        loading="lazy"
      />
    );
  }

  // 4. Fallback: Render Lucide Icon (for Start Trigger, Logic, or failed loads)
  const LucideIcon = ICON_MAP[iconName] || ICON_MAP["Globe"];

  // We apply specific colors to system icons so they look nice too
  let systemColor = "text-gray-500";
  if (type === "trigger_start") systemColor = "text-green-600";
  if (type === "agent") systemColor = "text-purple-600";

  return <LucideIcon className={`${className} ${systemColor}`} />;
};
