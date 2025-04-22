import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Loader } from '../../../components/Loader'
import { getSignInRoute } from '../../../lib/routes'
import { queryClient } from '../../../lib/trpc'

export const SignOutPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    Cookies.remove('token')
    queryClient.invalidateQueries().then(() => {
      navigate(getSignInRoute())
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Loader type="page" />
}
