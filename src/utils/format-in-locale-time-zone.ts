import { formatInTimeZone, FormatOptionsWithTZ } from 'date-fns-tz'
import { ptBR } from 'date-fns/locale/pt-BR'

export function formatInLocaleTimeZone(
  date: Date | string | number,
  formatStr: string,
  options: FormatOptionsWithTZ = {},
) {
  return formatInTimeZone(date, 'America/Sao_Paulo', formatStr, {
    locale: ptBR,
    ...options,
  })
}
