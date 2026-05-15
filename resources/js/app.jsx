import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './bootstrap'
import '../sass/app.scss'
import { store } from './store'
import Router from './router'
import { installMockApi } from './mock/mockApi'

if (typeof window !== 'undefined' && window.__EQUILIO_DEMO__) {
  installMockApi()
}

function App() {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  )
}

export default App

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(<App />)
}
