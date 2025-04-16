import { trpc } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { createTaskTrpcRoute } from './createTask'
import { getMeTrpcRoute } from './getMe'
import { getTaskTrpcRoute } from './getTask'
import { getTasksTrpcRoute } from './getTasks'
import { signInTrpcRoute } from './signIn'
import { signUpTrpcRoute } from './signUp'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  createTask: createTaskTrpcRoute,
  getMe: getMeTrpcRoute,
  getTask: getTaskTrpcRoute,
  getTasks: getTasksTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  // @endindex
})
export type TrpcRouter = typeof trpcRouter

// TODO @index('./**/index.ts', f => `//${JSON.stringify(f)}`)
//{"path":"./createTask/index","name":"index","ext":".ts"}
//{"path":"./getMe/index","name":"index","ext":".ts"}
//{"path":"./getTask/index","name":"index","ext":".ts"}
//{"path":"./getTasks/index","name":"index","ext":".ts"}
//{"path":"./signIn/index","name":"index","ext":".ts"}
//{"path":"./signUp/index","name":"index","ext":".ts"}
// @endindex
