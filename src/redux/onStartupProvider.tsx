import React, { useEffect } from 'react'
import { AppDispatch } from './store'
import { getTrapVisitDropdownValues } from './reducers/dropdownsSlice'
import { useDispatch } from 'react-redux'

type Props = {
  children: React.ReactNode
}

const OnStartupProvider = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getTrapVisitDropdownValues())
  }, [])

  return <>{props.children}</>
}

export default OnStartupProvider
