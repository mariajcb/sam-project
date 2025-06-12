import { ReactNode } from 'react'
import styles from '../styles/components/TextBox.module.css'

interface TextBoxProps {
  children: ReactNode
  className?: string
}

export default function TextBox({ children, className = '' }: TextBoxProps) {
  return (
    <div className={`${styles.contentWrapper} ${className}`}>
      <div className={styles.outerBorder}></div>
      <div className={styles.innerBorder}></div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
} 