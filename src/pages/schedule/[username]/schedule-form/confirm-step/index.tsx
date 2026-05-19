import { TextInput } from '@/components/text-input'
import { formatInLocaleTimeZone } from '@/utils/format-in-locale-time-zone'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextArea } from '@ignite-ui/react'
import { getHours } from 'date-fns'
import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ConfirmForm, FormActions, FormError, FormHeader } from './styles'

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Mínimo de 3 caracteres requerido.' })
    .max(150),
  email: z.email({ message: 'Digite um e-mail válido.' }).max(150),
  observations: z.string().max(255).nullable(),
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

interface ConfirmStepProps {
  schedulingDate: Date
  onCancel: () => void
}

export function ConfirmStep({ schedulingDate, onCancel }: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  })

  const formattedSchedulingDate = formatInLocaleTimeZone(
    schedulingDate,
    "dd 'de' MMMM 'de' yyyy",
  )

  const schedulingDateHour = getHours(schedulingDate)

  function handleConfirmScheduling(data: ConfirmFormData) {
    console.log(data)
  }

  function handleCancel() {
    onCancel()
  }

  return (
    <ConfirmForm
      as="form"
      onSubmit={handleSubmit(handleConfirmScheduling)}
    >
      <FormHeader>
        <Text>
          <CalendarBlank />
          {formattedSchedulingDate}
        </Text>
        <Text>
          <Clock />
          {String(schedulingDateHour).padStart(2, '0')}:00h
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput
          placeholder="Seu nome"
          {...register('name')}
        />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          {...register('email')}
        />
        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('observations')} />
      </label>

      <FormActions>
        <Button
          type="button"
          variant="tertiary"
          onClick={handleCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  )
}
