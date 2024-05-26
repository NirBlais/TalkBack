import React from 'react'
import './User.css'
import { useState } from 'react'

const User = ({userName="user",SelectUser,onDoubleClick,isActive=true}) => {
  const [checked,setChecked] = useState(false)
  const Select = () => {     
      // console.log(`turn: ${turn}`)
      if(!checked)
      {
        SelectUser(userName)
        setChecked(true)
      }              
      else 
      {
        SelectUser(null)
          setChecked(false)
      }     

  }

  return (
    <div className='user-container'>
        {(isActive) && <input type='checkbox' id={`${userName}`} className='user-checkbox' onChange={() => Select()} onDoubleClick={()=>onDoubleClick()}/>}

    <div className='information-container'>
        <img className='user-profile' alt='user profile' src='../../../images/user.png'/>
        <div className='user-name'>{userName}</div>
    </div>
    </div>
  )
}

export default User