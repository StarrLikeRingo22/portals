import { createRoot } from 'react-dom/client'
import { App } from './App'
import NavBar from './NavBar'


function Root() {

  return (
    <>
      <NavBar />
      <App />
    </>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
