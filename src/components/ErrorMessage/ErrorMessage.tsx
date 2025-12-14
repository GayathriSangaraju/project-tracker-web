import styles from './error-message.module.css';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return <div className={styles['error-container']}>{message}</div>;
};
