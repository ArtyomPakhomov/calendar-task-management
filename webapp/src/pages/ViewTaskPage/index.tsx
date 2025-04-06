import { useParams } from 'react-router'

export const ViewTaskPage = () => {
  const { id } = useParams() as { id: string }
  return (
    <div>
      <h1>title</h1>
      <div>{id}</div>
      <p>descr</p>
    </div>
  )
}
