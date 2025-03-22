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

type ImageSliderProps = {
  variant: VariantsWithImagesAndTags[];
};

const ImageSlider = ({ variant }: ImageSliderProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState<number[]>([0]);

  const searchParams = useSearchParams();
  const currentVariantType = searchParams.get("type");

  useEffect(() => {
    if (!api) return;
    api.on("slidesInView", (e) => setActiveIndex(e.slidesInView));
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {variant.map(
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
                  />
                )}
              </CarouselItem>
            ))
        )}
      </CarouselContent>
      <div className="flex gap-2 py-2">
        {variant.map(
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
