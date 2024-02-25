import {
  DEFAULT_ICON_HEIGHT_PX,
  DEFAULT_ICON_STROKE,
  DEFAULT_ICON_WIDTH_PX,
  IconProps,
} from './icon-utils';

export function XIcon({
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
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}
