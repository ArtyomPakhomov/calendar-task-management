import axios, { type AxiosResponse } from 'axios'
import _ from 'lodash'
import { env } from './env'

const makeRequestToRusender = async ({
  path,
  data,
}: {
  path: string
  data: Record<string, any>
}): Promise<{
  originalResponse?: AxiosResponse
  loggableResponse: Pick<AxiosResponse, 'status' | 'statusText' | 'data'>
}> => {
  if (!env.RUSENDER_API_KEY || env.NODE_ENV === 'test') {
    return {
      loggableResponse: {
        status: 200,
        statusText: 'OK',
        data: { message: 'Rusender is disabled' },
      },
    }
  }
  const response = await axios({
    method: 'POST',
    url: `https://api.beta.rusender.ru/api/v1/${path}`,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': env.RUSENDER_API_KEY,
    },
    data,
  })
  return {
    originalResponse: response,
    loggableResponse: _.pick(response, ['status', 'statusText', 'data']),
  }
}

export const sendEmailThroughRusender = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) => {
  return await makeRequestToRusender({
    path: 'external-mails/send',
    data: {
      mail: {
        to: {
          email: to,
          name: 'CTM',
        },
        from: {
          email: env.FROM_EMAIL_ADDRESS,
          name: env.FROM_EMAIL_NAME,
        },
        subject,
        html,
      },
    },
  })
}
