import React, { createContext, useCallback, useContext, useRef } from 'react'

type SaveHandler = (() => void) | null

interface FormSaveContextType {
  registerSaveHandler: (fn: SaveHandler) => void
  saveCurrentForm: () => void
}

const FormSaveContext = createContext<FormSaveContextType>({
  registerSaveHandler: () => {},
  saveCurrentForm: () => {},
})

export const FormSaveProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const handlerRef = useRef<SaveHandler>(null)

  const registerSaveHandler = useCallback((fn: SaveHandler) => {
    handlerRef.current = fn
  }, [])

  const saveCurrentForm = useCallback(() => {
    handlerRef.current?.()
  }, [])

  return (
    <FormSaveContext.Provider value={{ registerSaveHandler, saveCurrentForm }}>
      {children}
    </FormSaveContext.Provider>
  )
}

export const useFormSave = () => useContext(FormSaveContext)
