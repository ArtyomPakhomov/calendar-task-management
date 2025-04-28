import { promises as fs } from 'fs'
import path from 'path'
import { getNewTasksRoute } from '@calendar-task-management/webapp/src/lib/routes'
import { type Task, type User } from '@prisma/client'
import fg from 'fast-glob'
import Handlebars from 'handlebars'
import _ from 'lodash'
import { env } from './env'
import { logger } from './logger'
import { sendEmailThroughRusender } from './rusender'

const getHbrTemplates = _.memoize(async () => {
  const htmlPathsPattern = path.resolve(__dirname, '../emails/dist/**/*.html')
  const htmlPaths = fg.sync(htmlPathsPattern)
  const hbrTemplates: Record<string, HandlebarsTemplateDelegate> = {}
  for (const htmlPath of htmlPaths) {
    const templateName = path.basename(htmlPath, '.html')
    const htmlTemplate = await fs.readFile(htmlPath, 'utf8')
    hbrTemplates[templateName] = Handlebars.compile(htmlTemplate)
  }
  return hbrTemplates
})

const getEmailHtml = async (templateName: string, templateVariables: Record<string, string> = {}) => {
  const hbrTemplates = await getHbrTemplates()
  const hbrTemplate = hbrTemplates[templateName]
  const html = hbrTemplate(templateVariables)
  return html
}

const sendEmail = async ({
  to,
  subject,
  templateName,
  templateVariables = {},
}: {
  to: string
  subject: string
  templateName: string
  templateVariables?: Record<string, any>
}) => {
  try {
    const fullTemplateVaraibles = {
      ...templateVariables,
      homeUrl: env.WEBAPP_URL,
    }
    const html = await getEmailHtml(templateName, fullTemplateVaraibles)
    const { loggableResponse } = await sendEmailThroughRusender({ to, html, subject })
    logger.info({
      logType: 'email',
      message: 'sendEmail',
      meta: {
        to,
        templateName,
        templateVariables,
        // html,
        response: loggableResponse,
      },
    })
    return { ok: true }
  } catch (error) {
    logger.error({ logType: 'email', error, meta: { to, templateName, templateVariables } })
    return { ok: false }
  }
}

export const sendWelcomeEmail = async ({ user }: { user: Pick<User, 'name' | 'email'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Thanks For Registration!',
    templateName: 'welcome',
    templateVariables: {
      userName: user.name,
      addTaskUrl: `${getNewTasksRoute({ abs: true })}`,
    },
  })
}
export const sendTaskBlockedEmail = async ({
  user,
  task,
}: {
  user: Pick<User, 'email'>
  task: Pick<Task, 'title'>
}) => {
  return await sendEmail({
    to: user.email,
    subject: 'Your Task Blocked!',
    templateName: 'taskBlocked',
    templateVariables: {
      taskTitle: task.title,
    },
  })
}
