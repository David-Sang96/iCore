"use client";

import { VariantsWithImagesAndTags } from "@/lib/infer-types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";

type ImageSliderProps = {
  variant: VariantsWithImagesAndTags[];
};

const ImageSlider = ({ variant }: ImageSliderProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState<number[]>([0]);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const currentVariantType = searchParams.get("type");

  useEffect(() => {
    if (!api) return;
    api.on("slidesInView", (e) => setActiveIndex(e.slidesInView));
  }, [api]);

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeoutId);
  }, [currentVariantType]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {loading
          ? Array(1)
              .fill(0)
              .map((_, i) => (
                <CarouselItem>
                  <Skeleton className="w-full h-[448px] rounded-md" key={i} />
                </CarouselItem>
              ))
          : variant.map(
              (v) =>
                v.productType === currentVariantType &&
                v.variantImages.map((img) => (
                  <CarouselItem key={img.image_url}>
                    {img.image_url && (
                      <Image
                        src={img.image_url}
                        alt={img.name}
                        width={448}
                        height={448}
                        sizes="(min-width: 1220px) 552px, (min-width: 380px) 46.59vw, calc(66.67vw - 80px)"
                        className="w-full h-auto object-cover rounded-md"
                        onLoad={() => setLoading(false)}
                        onError={() => setLoading(false)}
                      />
                    )}
                  </CarouselItem>
                ))
            )}
      </CarouselContent>
      <div className="flex gap-2 py-2">
        {loading
          ? Array(
              variant.find((v) => v.productType === currentVariantType)
                ?.variantImages.length || 0
            )
              .fill(0)
              .map((_, i) => (
                <Skeleton className="rounded-md w-[72px] h-[50px]" key={i} />
              ))
          : variant.map(
              (v) =>
                v.productType === currentVariantType &&
                v.variantImages.map((img, idx) => (
                  <div key={img.image_url}>
                    {img.image_url ? (
                      <Image
                        src={img.image_url}
                        alt={img.name}
                        width={72}
                        height={42}
                        priority
                        className={cn(
                          "rounded-md cursor-pointer border-2 bg-slate-200 ",
                          idx === activeIndex[0]
                            ? "border-slate-400 opacity-100"
                            : "opacity-50"
                        )}
                        onClick={() => api?.scrollTo(idx)}
                      />
                    ) : null}
                  </div>
                ))
            )}
      </div>
    </Carousel>
  );
};

export default ImageSlider;
