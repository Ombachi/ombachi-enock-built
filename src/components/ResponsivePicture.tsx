import type { ImgHTMLAttributes } from "react";
import type { ResponsiveImageSet } from "@/lib/responsiveImages";

interface ResponsivePictureProps extends ImgHTMLAttributes<HTMLImageElement> {
  sources: ResponsiveImageSet;
  sizes: string;
}

const ResponsivePicture = ({ sources, sizes, ...imageProps }: ResponsivePictureProps) => (
  <picture>
    <source type="image/avif" srcSet={sources.avif} sizes={sizes} />
    <source type="image/webp" srcSet={sources.webp} sizes={sizes} />
    <img {...imageProps} sizes={sizes} />
  </picture>
);

export default ResponsivePicture;
