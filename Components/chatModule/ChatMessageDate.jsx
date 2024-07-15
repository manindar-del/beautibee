import { Chip } from '@mui/material'
import React from 'react'
import styles from '@/styles/pages/chat.module.scss'

const ChatMessageDate = ({info}) => {
  return (
    <div className={styles.chip_date}>
        <Chip label={info}/>
    </div>
  )
}

export default ChatMessageDate