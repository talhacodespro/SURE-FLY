import { forwardRef, type Ref } from 'react'
import { Input } from 'rsuite'

interface TextareaProps {
  rows?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref: Ref<HTMLTextAreaElement>) => {
    const { rows = 2, ...rest } = props
    return <Input {...rest} as="textarea" ref={ref} rows={rows} style={{ resize: 'none' }} />
  },
)

export default Textarea
