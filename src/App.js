import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Dashboard } from './components/Dashboard'
import { Error } from './components/Error'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />}></Route>
        <Route path='*' element={<Error />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
