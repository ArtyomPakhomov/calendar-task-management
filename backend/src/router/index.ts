import { createTrpcRouter } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { getMeTrpcRoute } from './auth/getMe'
import { signInTrpcRoute } from './auth/signIn'
import { signUpTrpcRoute } from './auth/signUp'
import { updatePasswordTrpcRoute } from './auth/updatePassword'
import { updateProfileTrpcRoute } from './auth/updateProfile'
import { blockTaskTrpcRoute } from './tasks/blockTask'
import { createTaskTrpcRoute } from './tasks/createTask'
import { getTaskTrpcRoute } from './tasks/getTask'
import { getTasksTrpcRoute } from './tasks/getTasks'
import { setTaskLikeTrpcRoute } from './tasks/setTaskLike'
import { updateTaskTrpcRoute } from './tasks/updateTask'
// @endindex
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

export const trpcRouter = createTrpcRouter({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  getMe: getMeTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  updatePassword: updatePasswordTrpcRoute,
  updateProfile: updateProfileTrpcRoute,
  blockTask: blockTaskTrpcRoute,
  createTask: createTaskTrpcRoute,
  getTask: getTaskTrpcRoute,
  getTasks: getTasksTrpcRoute,
  setTaskLike: setTaskLikeTrpcRoute,
  updateTask: updateTaskTrpcRoute,
  // @endindex
})
export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>

// TODO @index('./**/index.ts', f => `//${JSON.stringify(f)}`)
//{"path":"./auth/getMe/index","name":"index","ext":".ts"}
//{"path":"./auth/signIn/index","name":"index","ext":".ts"}
//{"path":"./auth/signUp/index","name":"index","ext":".ts"}
//{"path":"./auth/updatePassword/index","name":"index","ext":".ts"}
//{"path":"./auth/updateProfile/index","name":"index","ext":".ts"}
//{"path":"./tasks/blockTask/index","name":"index","ext":".ts"}
//{"path":"./tasks/createTask/index","name":"index","ext":".ts"}
//{"path":"./tasks/getTask/index","name":"index","ext":".ts"}
//{"path":"./tasks/getTasks/index","name":"index","ext":".ts"}
//{"path":"./tasks/setTaskLike/index","name":"index","ext":".ts"}
//{"path":"./tasks/updateTask/index","name":"index","ext":".ts"}
// @endindex
