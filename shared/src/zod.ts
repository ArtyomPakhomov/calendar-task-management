import { z } from 'zod'

export const zStringRequired = z.string().min(3, 'Input must be at least 3 characters long')
export const zInputRequired = zStringRequired.regex(/^[a-zA-Zа-яА-Я0-9-]+$/, 'Input must be only letters and numbers')
