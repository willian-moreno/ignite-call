import { TextInput } from '@/components/text-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text } from '@ignite-ui/react'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Form, Hint } from './styles'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Mínimo de 3 caracteres requerido.' })
    .max(50)
    .regex(/^([a-z\\-_]+)$/i, {
      message: 'Permitido somente letras, hífens e sublinhados.',
    })
    .transform((username) => username.toLocaleLowerCase()),
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  const router = useRouter()

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data

    await router.push(`/register?username=${username}`)
  }

  return (
    <>
      <Form
        as="form"
        onSubmit={handleSubmit(handleClaimUsername)}
      >
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuário"
          {...register('username')}
        />
        <Button
          size="sm"
          type="submit"
          disabled={isSubmitting}
        >
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <Hint>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : 'Digite o nome do usuário desejado.'}
        </Text>
      </Hint>
    </>
  )
}
