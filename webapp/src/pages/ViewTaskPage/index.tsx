import { useParams } from 'react-router'

import { ViewTaskRouteParams } from '../../lib/routes'

export const ViewTaskPage = () => {
  const { id } = useParams() as ViewTaskRouteParams
  return (
    <div>
      <h1>title</h1>
      <div>{id}</div>
      <p>descr</p>
    </div>
  )
}
