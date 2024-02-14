"use client"

import { useRef } from 'react'
import { AppStore, makeStore } from './store'
import { Provider } from 'react-redux'

type Props = {
  children: React.ReactNode
}

const StoreProvider = ({ children }: Props) => {

  const store = useRef<AppStore>() // loads the store on request basis in the client

  if(!store.current) {
    store.current = makeStore()
  }

  return (
    <Provider store={store.current}>
      {children}
    </Provider>
  )
}

export default StoreProvider