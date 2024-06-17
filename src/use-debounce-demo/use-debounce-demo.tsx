import { DemoSection } from '../components/demo-section';
import { ExampleContainer } from '../components/example-container';
import { UseDebounce } from '../_readme_sample_code/use-debounce/sample';

export function UseDebounceDemo() {
  return (
    <DemoSection title="useDebounce Hook">
      <ExampleContainer title="">
        <UseDebounce />
      </ExampleContainer>
    </DemoSection>
  );
}
