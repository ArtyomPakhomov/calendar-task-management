import { TRPCClientError } from '@trpc/client'
import { type FormikHelpers, useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useMemo, useState } from 'react'
import { sentryCaptureException } from './sentry'
import type { AlertProps } from '../components/Alert'
import type { ButtonProps } from '../components/Button'
import type { z } from 'zod'

export const useForm = <TZodSchema extends z.ZodTypeAny>({
  successMessage = false,
  resetOnSuccess = true,
  showValidationAlert = false,
  initialValues = {},
  validationSchema,
  onSubmit,
}: {
  successMessage?: string | false
  resetOnSuccess?: boolean
  showValidationAlert?: boolean
  initialValues?: z.infer<TZodSchema>
  validationSchema?: TZodSchema
  onSubmit?: (values: z.infer<TZodSchema>, actions: FormikHelpers<z.infer<TZodSchema>>) => Promise<any> | any
}) => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [submittingError, setSubmittingError] = useState<Error | null>(null)

  const formik = useFormik<z.infer<TZodSchema>>({
    initialValues,
    ...(validationSchema && { validate: withZodSchema(validationSchema) }),
    onSubmit: async (values, actions) => {
      if (!onSubmit) return
      try {
        setSubmittingError(null)
        await onSubmit(values, actions)
        if (resetOnSuccess) {
          formik.resetForm()
        }
        if (successMessage) {
          setSuccessMessageVisible(true)
          setTimeout(() => {
            setSuccessMessageVisible(false)
          }, 3000)
        }
      } catch (error: any) {
        if (!(error instanceof TRPCClientError)) {
          sentryCaptureException(error)
        }
        setSubmittingError(error)
      }
    },
  })

  const alertProps = useMemo<AlertProps>(() => {
    if (submittingError) {
      return {
        children: submittingError.message,
        color: 'red',
      }
    }
    if (showValidationAlert && !formik.isValid && !!formik.submitCount) {
      return {
        children: 'Some fields are invalid',
        color: 'red',
      }
    }
    if (successMessageVisible && successMessage) {
      return {
        children: successMessage,
        color: 'green',
      }
    }
    return {
      hidden: true,
      children: null,
    }
  }, [submittingError, successMessageVisible, successMessage, showValidationAlert, formik.isValid, formik.submitCount])

  const buttonProps = useMemo<Omit<ButtonProps, 'children'>>(() => {
    return {
      loading: formik.isSubmitting,
    }
  }, [formik.isSubmitting])

  return { formik, alertProps, buttonProps }
}
