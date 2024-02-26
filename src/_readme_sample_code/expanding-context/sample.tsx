import styles from './styles.module.scss';
import { useExpandingContext, withExpandingContext } from '../../../lib/main';

function WrappedComponent() {
  const { expanded, setExpanded } = useExpandingContext();
  return (
    <div
      className={styles.container}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className={styles.alwaysVisible}>
        Click here to {expanded ? 'collapse' : 'expanded'}!
      </div>
      {expanded && (
        <div
          className={styles.sometimesVisible}
          onClick={(event) => event.stopPropagation()}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </div>
      )}
    </div>
  );
}

export const ExpandingComponent = withExpandingContext(WrappedComponent);
