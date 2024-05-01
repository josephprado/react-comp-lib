import { DemoSection } from '../components/demo-section';
import { ExampleContainer } from '../components/example-container';
import { FilteredTable } from '../_readme_sample_code/use-filtering/sample';
import styles from './use-filtering-demo.module.scss';

export function UseFilteringDemo() {
  return (
    <DemoSection title="useFiltering Hook">
      <ExampleContainer title="" id={styles.filteredTableExample}>
        <FilteredTable />
      </ExampleContainer>
    </DemoSection>
  );
}
