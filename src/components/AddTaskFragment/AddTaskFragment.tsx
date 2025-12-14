import Button from '@mui/material/Button';
import { useContext } from 'react';
import { ModalContext, ModalType } from '../../contexts/ModalContextProvider';
import { AddEditTaskModal } from '../AddEditTaskModal/AddEditTaskModal';

interface AddTaskFragmentProps {
  isAddTaskDisabled?: boolean;
}

export const AddTaskFragment = ({ isAddTaskDisabled }: AddTaskFragmentProps) => {
  const { toggleModal } = useContext(ModalContext);

  const handleAddTaskClick = () => {
    toggleModal({ type: ModalType.AddEditTaskModal });
  };
  return (
    <>
      <Button
        variant="contained"
        type="button"
        disabled={isAddTaskDisabled}
        size="medium"
        onClick={handleAddTaskClick}
      >
        Add task
      </Button>
      <AddEditTaskModal />
    </>
  );
};
