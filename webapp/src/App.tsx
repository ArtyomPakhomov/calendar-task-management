import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { AppContextProvider } from './lib/ctx'
import * as routes from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import { AllTasksPage } from './pages/AllTasksPage/index'
import { EditTaskPage } from './pages/EditTaskPage'
import { NewTaskPage } from './pages/NewTaskPage'
import { SignInPage } from './pages/SignInPage'
import { SignOutPage } from './pages/SignOutPage'
import { SignUpPage } from './pages/SignUpPage'
import { ViewTaskPage } from './pages/ViewTaskPage'

function App() {
  return (
    <TrpcProvider>
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path={routes.getSignOutRoute()} element={<SignOutPage />} />
            <Route element={<Layout />}>
              <Route path={routes.getSignUpRoute()} element={<SignUpPage />} />
              <Route path={routes.getSignInRoute()} element={<SignInPage />} />
              <Route path={routes.getAllTasksRoute()} element={<AllTasksPage />} />
              <Route path={routes.getNewTasksRoute()} element={<NewTaskPage />} />
              <Route path={routes.getEditTaskRoute(routes.editTaskRouteParams)} element={<EditTaskPage />} />
              <Route path={routes.getViewTasksRoute(routes.viewTaskRouteParams)} element={<ViewTaskPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </TrpcProvider>
  )
}

export default App
