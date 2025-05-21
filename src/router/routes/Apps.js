// ** React Imports
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const AddVillage = lazy(() => import('../../views/dashboard/Configuration/addVillage'))
const AddLine = lazy(() => import('../../views/dashboard/Configuration/addLine'))
const AddNode = lazy(() => import('../../views/dashboard/Configuration/addNode'))

const AppRoutes = [
  {
    element: <AddVillage />,
    path: '/dashboard/Configuration/addVillage',
  },
  {
    element: <AddLine />,
    path: '/dashboard/Configuration/addLine',
  },
  {
    element: <AddNode />,
    path: '/dashboard/Configuration/addNode',
  },
]

export default AppRoutes

