import { TFunction } from 'i18next';
import { Category, defaultCategories } from '../store/settingsStore';

const DEFAULT_CATEGORY_IDS = new Set(defaultCategories.map((c) => c.id));

export function categoryName(category: Pick<Category, 'id' | 'name'> | undefined, t: TFunction): string {
  if (!category) return t('categories.other');
  return DEFAULT_CATEGORY_IDS.has(category.id) ? t(`categories.${category.id}`) : category.name;
}
