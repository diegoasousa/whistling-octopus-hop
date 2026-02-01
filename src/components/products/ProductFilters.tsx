import { CATEGORY_OPTIONS } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ProductFiltersValue = {
  category?: string;
  q?: string;
  minPrice?: string;
  maxPrice?: string;
};

const ALL_VALUE = "__all";

export function ProductFilters({
  value,
  onChange,
  onApply,
  onClear,
}: {
  value: ProductFiltersValue;
  onChange: (next: ProductFiltersValue) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-semibold tracking-widest text-foreground/60">
          FILTROS
        </div>
        <div className="mt-2 text-sm text-foreground/70">
          Refine sua busca por categoria e preço.
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-foreground/70">Busca</Label>
        <Input
          value={value.q ?? ""}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          placeholder="Ex: neon, colecionável…"
          className="h-10 rounded-2xl border-border/60 bg-muted/30 focus-visible:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-foreground/70">Categoria</Label>
        <Select
          value={value.category ?? ALL_VALUE}
          onValueChange={(v) =>
            onChange({ ...value, category: v === ALL_VALUE ? undefined : v })
          }
        >
          <SelectTrigger className="h-10 rounded-2xl border-border/60 bg-muted/30 focus:ring-primary">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value={ALL_VALUE}>Todas</SelectItem>
            {CATEGORY_OPTIONS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs text-foreground/70">Preço mín.</Label>
          <Input
            inputMode="numeric"
            value={value.minPrice ?? ""}
            onChange={(e) => onChange({ ...value, minPrice: e.target.value })}
            placeholder="0"
            className="h-10 rounded-2xl border-border/60 bg-muted/30 focus-visible:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-foreground/70">Preço máx.</Label>
          <Input
            inputMode="numeric"
            value={value.maxPrice ?? ""}
            onChange={(e) => onChange({ ...value, maxPrice: e.target.value })}
            placeholder="999"
            className="h-10 rounded-2xl border-border/60 bg-muted/30 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          className="h-10 flex-1 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onApply}
        >
          Aplicar
        </Button>
        <Button
          variant="secondary"
          className="h-10 rounded-2xl"
          onClick={onClear}
        >
          Limpar
        </Button>
      </div>
    </div>
  );
}