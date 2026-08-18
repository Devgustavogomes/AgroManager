export type UIIntent =
  "primary" | "secondary" | "danger" | "success" | "warning";

export type UISize = "sm" | "md" | "lg";

export interface BaseUIProps {
  intent?: UIIntent;
  size?: UISize;
  className?: string;
}
