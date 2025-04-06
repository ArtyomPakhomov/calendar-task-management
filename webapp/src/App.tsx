import { BrowserRouter, Route, Routes } from 'react-router'

import { getAllTasksRoute, getViewTasksRoute, viewTaskRouteParams } from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import { AllTasksPage } from './pages/AllTasksPage/index'
import { ViewTaskPage } from './pages/ViewTaskPage'

function App() {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route path={getAllTasksRoute()} element={<AllTasksPage />} />
          <Route path={getViewTasksRoute(viewTaskRouteParams)} element={<ViewTaskPage />} />
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  )
}

export default App
