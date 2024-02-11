import { useState } from 'react';
import { DEFAULT_ICON_WIDTH_PX, Input } from '../../lib/main';
import { UserIcon } from '../../lib/components/icons/user-icon';
import { DemoSection } from '../components/demo-section';
import { ExampleContainer } from '../components/example-container';
import styles from './input-demo.module.scss';

export function InputDemo() {
  const [values, setValues] = useState<{ [key: string]: string }>({});

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <DemoSection title="INPUT">
      <div className={styles.examples}>
        <ExampleContainer title="Default Text Input">
          <Input
            type="text"
            name="default-text-input"
            value={values['default-text-input']}
            onChange={handleChange}
            autocomplete=""
          />
        </ExampleContainer>

        <ExampleContainer title="Default Password Input">
          <Input
            type="password"
            name="default-password-input"
            value={values['default-password-input']}
            onChange={handleChange}
            autocomplete=""
          />
        </ExampleContainer>

        <ExampleContainer title="Default Search Input">
          <Input
            type="search"
            name="default-search-input"
            value={values['default-search-input']}
            onChange={handleChange}
            autocomplete=""
          />
        </ExampleContainer>

        <ExampleContainer title="Default Number Input">
          <Input
            type="number"
            name="default-number-input"
            value={values['default-number-input']}
            onChange={handleChange}
            autocomplete=""
          />
        </ExampleContainer>

        <ExampleContainer title="Default Date Input">
          <Input
            type="date"
            name="default-date-input"
            value={values['default-date-input']}
            onChange={handleChange}
            autocomplete=""
          />
        </ExampleContainer>

        <ExampleContainer title="Default Datetime Input">
          <Input
            type="datetime-local"
            name="default-datetime-local-input"
            value={values['default-datetime-local-input']}
            onChange={handleChange}
            autocomplete=""
          />
        </ExampleContainer>

        <ExampleContainer title="Default Month Input">
          <Input
            type="month"
            name="default-month-input"
            value={values['default-month-input']}
            onChange={handleChange}
            autocomplete=""
          />
        </ExampleContainer>

        <ExampleContainer title="Default Week Input">
          <Input
            type="week"
            name="default-week-input"
            value={values['default-week-input']}
            onChange={handleChange}
            autocomplete=""
          />
        </ExampleContainer>

        <ExampleContainer title="Default Time Input">
          <Input
            type="time"
            name="default-time-input"
            value={values['default-time-input']}
            onChange={handleChange}
            autocomplete=""
          />
        </ExampleContainer>

        <ExampleContainer title="Disabled">
          <Input
            type="text"
            name="disabled"
            value={values['disabled']}
            onChange={handleChange}
            autocomplete=""
            disabled
          />
        </ExampleContainer>

        <ExampleContainer title="Readonly">
          <Input
            type="text"
            name="readonly"
            value="Can't touch this!"
            onChange={handleChange}
            autocomplete=""
            readonly
          />
        </ExampleContainer>

        <ExampleContainer title="With Placeholder">
          <Input
            type="search"
            name="with-placeholder"
            value={values['with-placeholder']}
            onChange={handleChange}
            autocomplete=""
            placeholder="Search"
          />
        </ExampleContainer>

        <ExampleContainer title="Icon Left">
          <Input
            type="text"
            name="icon-left"
            value={values['icon-left']}
            onChange={handleChange}
            autocomplete=""
            iconL={<UserIcon />}
            iconLSizePx={DEFAULT_ICON_WIDTH_PX}
          />
        </ExampleContainer>

        <ExampleContainer title="Icon Right">
          <Input
            type="text"
            name="icon-right"
            value={values['icon-right']}
            onChange={handleChange}
            autocomplete=""
            iconR={<UserIcon />}
            iconRSizePx={DEFAULT_ICON_WIDTH_PX}
          />
        </ExampleContainer>

        <ExampleContainer title="Two Icons">
          <Input
            type="text"
            name="two-icons"
            value={values['two-icons']}
            onChange={handleChange}
            autocomplete=""
            iconL={<UserIcon />}
            iconLSizePx={DEFAULT_ICON_WIDTH_PX}
            iconR={<UserIcon />}
            iconRSizePx={DEFAULT_ICON_WIDTH_PX}
          />
        </ExampleContainer>
      </div>
    </DemoSection>
  );
}
