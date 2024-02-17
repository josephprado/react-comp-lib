import { useEffect, useState } from 'react';
import { useExpandingContext } from '../../lib/components/expanding-context/use-expanding-context';
import { withExpandingContext } from '../../lib/components/expanding-context/with-expanding-context';
import { DemoSection } from '../components/demo-section';
import { ExampleContainer } from '../components/example-container';
import styles from './expanding-context-demo.module.scss';
import clsx from 'clsx';

function ExpandingComponent() {
  const { expanded, setExpanded } = useExpandingContext();

  return (
    <div
      className={styles.expandingContainer}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className={styles.alwaysVisible}>
        Click me to {expanded ? 'collapse' : 'expanded'}!
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

function AnimatedExpandingComponent() {
  const { expanded, setExpanded } = useExpandingContext();

  return (
    <div
      className={clsx(
        styles.expandingContainer,
        styles.animated,
        !expanded && styles.collapsed,
      )}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className={styles.alwaysVisible}>
        Click me to {expanded ? 'collapse' : 'expanded'}!
      </div>
      <div
        className={clsx(styles.sometimesVisible, !expanded && styles.collapsed)}
        onClick={(event) => event.stopPropagation()}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </div>
    </div>
  );
}

export function ExpandingContextDemo() {
  const [reset, setReset] = useState<boolean>(false);

  const DemoComponentContracted = withExpandingContext(ExpandingComponent);
  const DemoComponentExpanded = withExpandingContext(ExpandingComponent, true);
  const DemoAnimatedExpandingComponent = withExpandingContext(
    AnimatedExpandingComponent,
  );

  useEffect(() => {
    if (reset) setReset(false);
  }, [reset]);

  return (
    <DemoSection title="EXPANDING CONTEXT">
      <div className={styles.examples}>
        <ExampleContainer title="Default Contracted">
          <DemoComponentContracted />
        </ExampleContainer>

        <ExampleContainer title="Default Expanded">
          <DemoComponentExpanded />
        </ExampleContainer>

        <ExampleContainer title="Animated Expansion">
          <DemoAnimatedExpandingComponent />
        </ExampleContainer>
      </div>
      <button type="button" onClick={() => setReset(true)}>
        Reset
      </button>
    </DemoSection>
  );
}
