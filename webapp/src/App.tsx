import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { NotAuthRouteTracker } from './components/NotAuthRouteTracker'
import { AppContextProvider } from './lib/ctx'
import * as routes from './lib/routes'
import { SentryUser } from './lib/sentry'
import { TrpcProvider } from './lib/trpc'
import { EditProfilePage } from './pages/auth/EditProfilePage'
import { SignInPage } from './pages/auth/SignInPage'
import { SignOutPage } from './pages/auth/SignOutPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { CalendarPage } from './pages/calendar'
import { NotFoundPage } from './pages/other/NotFoundPage'
import { AllTasksPage } from './pages/tasks/AllTasksPage'
import { EditTaskPage } from './pages/tasks/EditTaskPage'
import { NewTaskPage } from './pages/tasks/NewTaskPage'
import { ViewTaskPage } from './pages/tasks/ViewTaskPage'
import './styles/global.scss'

function App() {
  return (
    <TrpcProvider>
      <AppContextProvider>
        <BrowserRouter>
          <SentryUser />
          <NotAuthRouteTracker />
          <Routes>
            <Route path={routes.getSignOutRoute.route} element={<SignOutPage />} />
            <Route element={<Layout />}>
              <Route path={routes.getSignUpRoute.route} element={<SignUpPage />} />
              <Route path={routes.getSignInRoute.route} element={<SignInPage />} />
              <Route path={routes.getEditProfileRoute.route} element={<EditProfilePage />} />
              <Route path={routes.getCalendarRoute.route} element={<CalendarPage />} />
              <Route path={routes.getAllTasksRoute.route} element={<AllTasksPage />} />
              <Route path={routes.getNewTasksRoute.route} element={<NewTaskPage />} />
              <Route path={routes.getEditTaskRoute.route} element={<EditTaskPage />} />
              <Route path={routes.getViewTasksRoute.route} element={<ViewTaskPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </TrpcProvider>
  )
}

export default App
