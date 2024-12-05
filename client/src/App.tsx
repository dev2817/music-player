import { Toaster } from 'react-hot-toast'
import './App.css'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
      />
    </>
  )
}

export default App
