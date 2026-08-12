import { SITE } from "@/lib/seo/site";

type Props = {
  className?: string;
  width?: number;
  height?: number;
};

/** Brand mark from public/logo.svg */
export function SiteLogo({ className, width = 72, height = 72 }: Props) {
  return (
    <img
      src={SITE.logo}
      alt=""
      width={width}
      height={height}
      className={className}
      decoding="async"
    />
  );
}
