import {
  DEFAULT_ICON_HEIGHT_PX,
  DEFAULT_ICON_STROKE,
  DEFAULT_ICON_WIDTH_PX,
  IconProps,
} from './icon-utils';

export function XCircleIcon({
  className,
  width = DEFAULT_ICON_WIDTH_PX,
  height = DEFAULT_ICON_HEIGHT_PX,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={DEFAULT_ICON_STROKE}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}
