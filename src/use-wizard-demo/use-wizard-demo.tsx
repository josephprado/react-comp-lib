import { DemoSection } from '../components/demo-section';
import { ExampleContainer } from '../components/example-container';
import { WizardComponent } from '../_readme_sample_code/use-wizard/sample';

export function UseWizardDemo() {
  return (
    <DemoSection title="useWizard Hook">
      <ExampleContainer title="">
        <WizardComponent />
      </ExampleContainer>
    </DemoSection>
  );
}
