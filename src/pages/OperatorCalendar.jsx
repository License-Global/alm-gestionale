import React from 'react'
import OperatorAgenda from '../components/Calendar/OperatorAgenda'
import { useParams } from 'react-router-dom'

const OperatorCalendar = () => {
    const {id} = useParams()
  return (
    <div><OperatorAgenda operatorId={id}/></div>
  )
}

export default OperatorCalendar