import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './app/store'

export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector = <TSelected>(selector: (state: RootState) => TSelected): TSelected =>
  useSelector(selector)
