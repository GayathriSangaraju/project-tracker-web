import React, { Reducer, createContext, ReactNode } from 'react';

export enum ModalType {
  AddEditTaskModal,
  AddEditProjectModal,
}

export type ModalPayload = {
  isEditMode?: boolean;
  projectId?: string;
  taskId?: string;
};

export type ModalAction = {
  type: ModalType;
  payload?: ModalPayload;
};

type ModalInitialState = {
  isAddTaskModalOpen: boolean;
  isAddProjectModalOpen: boolean;
  payload?: ModalPayload;
};

interface ModalContextProps {
  modalState: ModalInitialState;
  toggleModal: React.Dispatch<ModalAction>;
}

const initialModalState: ModalInitialState = {
  isAddProjectModalOpen: false,
  isAddTaskModalOpen: false,
};

const modalReducer: Reducer<ModalInitialState, ModalAction> = (state, action) => {
  switch (action.type) {
    case ModalType.AddEditProjectModal:
      return {
        ...state,
        isAddProjectModalOpen: !state.isAddProjectModalOpen,
        payload: state.isAddProjectModalOpen ? undefined : action.payload,
      };
    case ModalType.AddEditTaskModal:
      return {
        ...state,
        isAddTaskModalOpen: !state.isAddTaskModalOpen,
        payload: state.isAddTaskModalOpen ? undefined : action.payload,
      };
    default:
      return state;
  }
};

export const ModalContext = createContext<ModalContextProps>({
  modalState: initialModalState,
  toggleModal: () => {},
});

export const ModalContextProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, toggleModal] = React.useReducer(modalReducer, initialModalState);
  return (
    <ModalContext.Provider value={{ modalState, toggleModal }}>{children}</ModalContext.Provider>
  );
};
