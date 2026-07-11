export interface CategoryOption {
  value: string;
  label: string;
}

export function normalizeCategoryValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatCategoryLabel(value: string): string {
  const normalized = normalizeCategoryValue(value);
  if (!normalized) {
    return value.trim();
  }
  return normalized
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}

export function mergeCategoryOptions(options: CategoryOption[]): CategoryOption[] {
  const unique = new Map<string, CategoryOption>();
  for (const option of options) {
    if (!option.value) continue;
    unique.set(option.value, option);
  }
  return Array.from(unique.values()).sort((a, b) => a.label.localeCompare(b.label));
}
