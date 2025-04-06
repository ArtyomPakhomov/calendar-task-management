import _ from 'lodash'

export const tasks = _.times(5, (i) => ({
  id: `${i + 1}`,
  title: `Title ${i + 1}`,
  description: `Description of title ${i + 1}...`,
}))
