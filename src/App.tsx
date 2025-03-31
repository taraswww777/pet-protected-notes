import { BrowserRouter } from 'react-router'
import { store } from './store'
import { Provider } from 'react-redux'
import { Router } from './Router'

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
    </Provider>
  )
}
