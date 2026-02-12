import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
  extra,
}: {
  images: string[];
  name: string;
  extra?: React.ReactNode;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl border border-border/60 bg-muted/20 text-xs text-foreground/60">
        Sem imagens
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Carousel
        setApi={(a) => {
          setApi(a);
          a.on("select", () => setActive(a.selectedScrollSnap()));
        }}
        className="rounded-3xl border border-border/60 bg-muted/20"
      >
        <CarouselContent>
          {images.map((src, idx) => (
            <CarouselItem key={src + idx}>
              <div className="aspect-square overflow-hidden rounded-3xl">
                <img
                  src={src}
                  alt={`${name} - imagem ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((src, idx) => (
          <button
            key={src + "thumb" + idx}
            type="button"
            onClick={() => {
              setActive(idx);
              api?.scrollTo(idx);
            }}
            className={cn(
              "h-16 w-16 shrink-0 overflow-hidden rounded-2xl border transition",
              idx === active
                ? "border-primary/70 ring-2 ring-primary/30"
                : "border-border/60 opacity-80 hover:opacity-100",
            )}
            aria-label={`Ver imagem ${idx + 1}`}
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {extra ? <div className="space-y-3">{extra}</div> : null}
    </div>
  );
}
