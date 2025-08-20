import { TextInputProps, TextInput as TextInputUI } from '@ignite-ui/react'

export function TextInput(props: TextInputProps) {
  return (
    <TextInputUI
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      crossOrigin={undefined}
      {...props}
    />
  )
}
