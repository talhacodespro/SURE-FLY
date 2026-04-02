import { Message } from 'rsuite'

type MessageProps = {
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const message = ({ message, type, ...props }: MessageProps) => {
  return (
    <Message type={type} {...props} showIcon>
      {message}
    </Message>
  )
}

export default message
