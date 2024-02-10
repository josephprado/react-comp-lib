import {
  DEFAULT_ICON_HEIGHT_PX,
  DEFAULT_ICON_STROKE,
  DEFAULT_ICON_WIDTH_PX,
  IconProps,
} from './icon-utils';

export default function MenuIcon({
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
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}
