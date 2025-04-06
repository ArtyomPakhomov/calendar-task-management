import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import * as routes from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import { AllTasksPage } from './pages/AllTasksPage/index'
import { NewTaskPage } from './pages/NewTaskPage'
import { ViewTaskPage } from './pages/ViewTaskPage'

function App() {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path={routes.getAllTasksRoute()} element={<AllTasksPage />} />
            <Route path={routes.getNewTasksRoute()} element={<NewTaskPage />} />
            <Route path={routes.getViewTasksRoute(routes.viewTaskRouteParams)} element={<ViewTaskPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  )
}

export default App
