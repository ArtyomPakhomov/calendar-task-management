import { BrowserRouter, Route, Routes } from 'react-router'

import { AllTasksPageRoute, ViewTaskPageRoute } from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import { AllTasksPage } from './pages/AllTasksPage/index'
import { ViewTaskPage } from './pages/ViewTaskPage'

function App() {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route path={AllTasksPageRoute()} element={<AllTasksPage />} />
          <Route path={ViewTaskPageRoute({ id: ':id' })} element={<ViewTaskPage />} />
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  )
}

export default App
