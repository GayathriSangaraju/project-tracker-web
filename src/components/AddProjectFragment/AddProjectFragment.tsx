import Button from '@mui/material/Button';
import { useContext } from 'react';
import { ModalContext, ModalType } from '../../contexts/ModalContextProvider';
import { AddEditProjectModal } from '../AddEditProjectModal/AddEditProjectModal';

export const AddProjectFragment = () => {
  const { toggleModal } = useContext(ModalContext);
  const handleAddProjectClick = () => {
    toggleModal({ type: ModalType.AddEditProjectModal });
  };
  return (
    <>
      <Button variant="contained" type="button" size="medium" onClick={handleAddProjectClick}>
        Add Project
      </Button>
      <AddEditProjectModal />
    </>
  );
};
