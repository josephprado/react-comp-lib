import { useState } from 'react';
import { DemoSection } from '../components/demo-section';
import { ExampleContainer } from '../components/example-container';
import styles from './modal-demo.module.scss';
import { Modal, ModalProps } from '../../lib/components/modal/modal';

interface DemoModalProps extends ModalProps {
  headerText?: string;
}

function DemoModal({
  headerText,
  backdrop,
  closeOnEscape,
  closeOnOutsideClick,
  onClose,
}: DemoModalProps) {
  return (
    <Modal
      className={styles.modal}
      backdrop={backdrop}
      closeOnEscape={closeOnEscape}
      closeOnOutsideClick={closeOnOutsideClick}
      onClose={onClose}
    >
      <div className={styles.modalDialogHeader}>
        {headerText}
        <button type="button" onClick={() => onClose()}>
          X
        </button>
      </div>
      <div className={styles.modalDialogBody}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Quam adipiscing
        vitae proin sagittis nisl rhoncus mattis rhoncus urna. Bibendum arcu
        vitae elementum curabitur vitae nunc sed velit. Non pulvinar neque
        laoreet suspendisse. Consequat mauris nunc congue nisi vitae. Eget
        mauris pharetra et ultrices neque ornare aenean. Quam adipiscing vitae
        proin sagittis nisl rhoncus. Pretium aenean pharetra magna ac placerat
        vestibulum lectus mauris ultrices. Vivamus arcu felis bibendum ut. Nibh
        mauris cursus mattis molestie. Volutpat commodo sed egestas egestas
        fringilla phasellus faucibus. Nisl pretium fusce id velit ut tortor
        pretium. Etiam sit amet nisl purus in mollis. Vitae congue eu consequat
        ac felis donec et. Vitae turpis massa sed elementum tempus egestas.
        Semper risus in hendrerit gravida rutrum quisque non. Eget mauris
        pharetra et ultrices neque. Eu mi bibendum neque egestas congue. Sit
        amet consectetur adipiscing elit ut aliquam. Sociis natoque penatibus et
        magnis dis parturient montes. Elit duis tristique sollicitudin nibh sit.
        Quis vel eros donec ac odio tempor. Lectus sit amet est placerat in
        egestas erat. Molestie at elementum eu facilisis sed odio morbi quis
        commodo. Arcu bibendum at varius vel pharetra vel. Leo duis ut diam quam
        nulla porttitor massa. Interdum varius sit amet mattis vulputate enim
        nulla aliquet porttitor. Purus in mollis nunc sed id semper risus in
        hendrerit. Lacinia quis vel eros donec ac. Sodales ut etiam sit amet
        nisl purus. Tellus id interdum velit laoreet id donec ultrices
        tincidunt. Urna neque viverra justo nec ultrices. Facilisi morbi tempus
        iaculis urna.
      </div>
      <div className={styles.modalDialogControls}>
        <button type="button">Cancel</button>
        <button type="button">Save</button>
      </div>
    </Modal>
  );
}

export function ModalDemo() {
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [showNoBackdrop, setShowNoBackdrop] = useState<boolean>(false);
  const [showCloseOnEscape, setShowCloseOnEscape] = useState<boolean>(false);
  const [showCloseOnOutsideClick, setShowCloseOnOutsideClick] =
    useState<boolean>(false);
  const [showCustomBackdrop, setShowCustomBackdrop] = useState<boolean>(false);

  return (
    <DemoSection title="MODAL">
      <div className={styles.examples}>
        <ExampleContainer title="With Backdrop">
          <button type="button" onClick={() => setShowBackdrop(true)}>
            Click Me!
          </button>
          {showBackdrop && (
            <DemoModal
              className={styles.modal}
              onClose={() => setShowBackdrop(false)}
              backdrop
            />
          )}
        </ExampleContainer>

        <ExampleContainer title="Without Backdrop">
          <button type="button" onClick={() => setShowNoBackdrop(true)}>
            Click Me!
          </button>
          {showNoBackdrop && (
            <DemoModal
              className={styles.modal}
              onClose={() => setShowNoBackdrop(false)}
            />
          )}
        </ExampleContainer>

        <ExampleContainer title="Close on Escape">
          <button type="button" onClick={() => setShowCloseOnEscape(true)}>
            Click Me!
          </button>
          {showCloseOnEscape && (
            <DemoModal
              headerText="Press Escape to Close"
              className={styles.modal}
              onClose={() => setShowCloseOnEscape(false)}
              closeOnEscape
              backdrop
            />
          )}
        </ExampleContainer>

        <ExampleContainer title="Close on Outside Click">
          <button
            type="button"
            onClick={() => setShowCloseOnOutsideClick(true)}
          >
            Click Me!
          </button>
          {showCloseOnOutsideClick && (
            <DemoModal
              headerText="Click Outside to Close"
              className={styles.modal}
              onClose={() => setShowCloseOnOutsideClick(false)}
              closeOnOutsideClick
              backdrop
            />
          )}
        </ExampleContainer>

        <ExampleContainer title="Custom Backdrop">
          <button type="button" onClick={() => setShowCustomBackdrop(true)}>
            Click Me!
          </button>
          {showCustomBackdrop && (
            <DemoModal
              className={styles.modal}
              onClose={() => setShowCustomBackdrop(false)}
              backdrop={styles.customBackdrop}
            />
          )}
        </ExampleContainer>
      </div>
    </DemoSection>
  );
}
