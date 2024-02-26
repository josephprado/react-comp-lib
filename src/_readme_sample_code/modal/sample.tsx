import styles from './styles.module.scss';
import { useState } from 'react';
import { Modal } from '../../../lib/main';

export function ModalExample() {
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <button type="button" onClick={() => setOpen((prev) => !prev)}>
        Open Modal
      </button>
      {open && (
        <Modal
          className={styles.modal}
          backdrop
          blur
          closeOnEscape
          closeOnOutsideClick
          onClose={handleClose}
        >
          <div className={styles.modalDialogHeader}>
            Modal Dialog
            <button type="button" onClick={handleClose}>
              X
            </button>
          </div>
          <div className={styles.modalDialogBody}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Quam
            adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna.
            Bibendum arcu vitae elementum curabitur vitae nunc sed velit. Non
            pulvinar neque laoreet suspendisse. Consequat mauris nunc congue
            nisi vitae.
          </div>
          <div className={styles.modalDialogControls}>
            <button type="button">Cancel</button>
            <button type="button">Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
