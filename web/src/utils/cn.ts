import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** 合并 Tailwind CSS 类 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
