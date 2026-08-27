/**
 * App root component.
 * Only responsibility: mount the app router.
 */
import { RouterProvider } from 'react-router'
import router from './router'

const App = () => {
  return <RouterProvider router={router} />
}

export default App
