import React, { Reducer, createContext, ReactNode } from 'react';

export enum ModalType {
  AddEditTaskModal = 'AddEditTaskModal',
  AddEditProjectModal = 'AddEditProjectModal',
}

export type ModalPayload = {
  isEditMode?: boolean;
  projectId?: string;
  taskId?: string;
};

type ModalAction =
  | { action: 'open'; type: ModalType; payload?: ModalPayload }
  | { action: 'close'; type: ModalType };

type ModalState = {
  isAddTaskModalOpen: boolean;
  isAddProjectModalOpen: boolean;
  payload?: ModalPayload;
};

interface ModalContextProps {
  modalState: ModalState;
  openModal: (type: ModalType, payload?: ModalPayload) => void;
  closeModal: (type: ModalType) => void;
}

const initialModalState: ModalState = {
  isAddProjectModalOpen: false,
  isAddTaskModalOpen: false,
};

const modalReducer: Reducer<ModalState, ModalAction> = (state, action) => {
  if (action.action === 'close') {
    switch (action.type) {
      case ModalType.AddEditProjectModal:
        return { ...state, isAddProjectModalOpen: false, payload: undefined };
      case ModalType.AddEditTaskModal:
        return { ...state, isAddTaskModalOpen: false, payload: undefined };
      default:
        return state;
    }
  }

  // action === 'open'
  switch (action.type) {
    case ModalType.AddEditProjectModal:
      return { ...state, isAddProjectModalOpen: true, payload: action.payload };
    case ModalType.AddEditTaskModal:
      return { ...state, isAddTaskModalOpen: true, payload: action.payload };
    default:
      return state;
  }
};

export const ModalContext = createContext<ModalContextProps>({
  modalState: initialModalState,
  openModal: () => {},
  closeModal: () => {},
});

export const ModalContextProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, dispatch] = React.useReducer(modalReducer, initialModalState);

  const openModal = (type: ModalType, payload?: ModalPayload) => {
    dispatch({ action: 'open', type, payload });
  };

  const closeModal = (type: ModalType) => {
    dispatch({ action: 'close', type });
  };

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
