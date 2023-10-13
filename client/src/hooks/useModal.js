import { useState } from 'react';

const useModal = () => {
  const [modal, setModal] = useState(false);

  const toggleModal = (e) => {
    setModal(!modal);
  };

  return [modal, toggleModal];
};

export default useModal;
