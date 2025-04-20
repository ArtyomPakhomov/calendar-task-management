import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { AppContextProvider } from './lib/ctx'
import * as routes from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import { SignInPage } from './pages/auth/SignInPage'
import { SignOutPage } from './pages/auth/SignOutPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { NotFoundPage } from './pages/other/NotFoundPage'
import { AllTasksPage } from './pages/tasks/AllTasksPage'
import { EditTaskPage } from './pages/tasks/EditTaskPage'
import { NewTaskPage } from './pages/tasks/NewTaskPage'
import { ViewTaskPage } from './pages/tasks/ViewTaskPage'

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
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </TrpcProvider>
  )
}

export default App
