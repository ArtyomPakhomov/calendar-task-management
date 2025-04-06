import { trpc } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { createTaskTrpcRoute } from './createTask'
import { getTaskTrpcRoute } from './getTask'
import { getTasksTrpcRoute } from './getTasks'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  createTask: createTaskTrpcRoute,
  getTask: getTaskTrpcRoute,
  getTasks: getTasksTrpcRoute,
  // @endindex
})
export type TrpcRouter = typeof trpcRouter

// TODO @index('./**/index.ts', f => `//${JSON.stringify(f)}`)
//{"path":"./createTask/index","name":"index","ext":".ts"}
//{"path":"./getTask/index","name":"index","ext":".ts"}
//{"path":"./getTasks/index","name":"index","ext":".ts"}
// @endindex
