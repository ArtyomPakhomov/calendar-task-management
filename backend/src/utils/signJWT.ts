import jwt from 'jsonwebtoken'
import { env } from '../lib/env'
export const signJWT = (userId: string) => {
  const token = jwt.sign(userId, env.JWT_SECRET)
  return token
}
