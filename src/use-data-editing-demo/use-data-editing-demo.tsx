import { DemoSection } from '../components/demo-section';
import { ExampleContainer } from '../components/example-container';
import { DataEditingComponent } from '../_readme_sample_code/use-data-editing/sample';

export function UseDataEditingDemo() {
  return (
    <DemoSection title="useDataEditing Hook">
      <ExampleContainer title="">
        <DataEditingComponent />
      </ExampleContainer>
    </DemoSection>
  );
}
