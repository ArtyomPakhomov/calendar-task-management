import { TrpcProvider } from './lib/trpc'
import { AllTasksPage } from './pages/AllTasksPage/index'

function App() {
  return (
    <TrpcProvider>
      <AllTasksPage />
    </TrpcProvider>
  )
}

export default App
