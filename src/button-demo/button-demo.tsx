import { Button } from '../../lib/main';
import { DemoSection } from '../components/demo-section';
import { ExampleContainer } from '../components/example-container';
import styles from './button-demo.module.scss';

export function ButtonDemo() {
  return (
    <DemoSection title="BUTTON">
      <div className={styles.examples}>
        <ExampleContainer title="Default Button">
          <Button>Button</Button>
        </ExampleContainer>

        <ExampleContainer title="With CSS Class">
          <Button className={styles.myButton}>CSS</Button>
        </ExampleContainer>

        <ExampleContainer title="With Style Object">
          <Button
            style={{
              border: 'none',
              padding: '0.5rem 1rem',
              backgroundColor: 'orange',
              color: 'white',
              boxShadow: '4px 4px 4px rgba(0,0,0,0.1)',
            }}
          >
            Style
          </Button>
        </ExampleContainer>

        <ExampleContainer title="With onClick">
          <Button onClick={() => window.alert('You clicked me!')}>
            Click Me
          </Button>
        </ExampleContainer>

        <ExampleContainer title="Disabled">
          <Button disabled>Disabled</Button>
        </ExampleContainer>

        <ExampleContainer title="With Title">
          <Button title="This is a button">Hover Me</Button>
        </ExampleContainer>
      </div>
    </DemoSection>
  );
}
