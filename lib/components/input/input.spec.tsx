import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DateInputType,
  EmailInputType,
  Input,
  InputType,
  NumberInputType,
  TextInputType,
} from './input';

const textInputs: TextInputType[] = [
  'password',
  'search',
  'tel',
  'text',
  'url',
];
const emailInputs: EmailInputType[] = ['email'];
const dateInputs: DateInputType[] = [
  'date',
  'datetime-local',
  'month',
  'time',
  'week',
];
const numberInputs: NumberInputType[] = ['number'];
const inputTypes: InputType[] = [
  ...textInputs,
  ...emailInputs,
  ...dateInputs,
  ...numberInputs,
];

const defaultValue: { [k: string]: string | number } = {
  password: 'very-secure-password',
  search: 'hello',
  tel: '1234567890',
  text: 'hello',
  url: 'http://www.foo.com',
  email: 'joe@email.com',
  date: '2023-01-01',
  'datetime-local': '2023-01-01T13:00',
  month: '2023-01',
  time: '13:30',
  week: '2023-W52',
  number: 123,
};

describe(Input.name, () => {
  it.each(inputTypes.map((type) => [type]))(
    'should be initialized with the expected value (%s)',
    (type: InputType) => {
      render(
        <label htmlFor="input">
          Input
          <Input
            id="input"
            type={type}
            name="test-input"
            autocomplete="off"
            value={defaultValue[type]}
            onChange={() => {}}
          />
        </label>,
      );

      const input = screen.getByLabelText('Input');
      const actual = (input as HTMLInputElement)?.value;

      expect(actual).toEqual(defaultValue[type]?.toString());
    },
  );

  it.each(
    // FIXME: Cannot test date types. `userEvent.type` is not working.
    [...textInputs, ...emailInputs, ...numberInputs].map((type) => [type]),
  )('should call onChange when input changes (%s)', async (type: InputType) => {
    const user = userEvent.setup();
    const mockSetValue = vi.fn();

    render(
      <label htmlFor="input">
        Input
        <Input
          id="input"
          type={type}
          name="test-input"
          autocomplete="off"
          onChange={mockSetValue}
        />
      </label>,
    );

    const input = screen.getByLabelText('Input');
    await user.type(input, defaultValue[type]?.toString().charAt(0));
    await waitFor(() => expect(mockSetValue).toBeCalledTimes(1));
  });

  it.each(inputTypes.map((type) => [type]))(
    'should render the expected left icon (%s)',
    (type: InputType) => {
      const iconContent = 'Hello';

      render(
        <label htmlFor="input">
          Input
          <Input
            id="input"
            type={type}
            name="test-input"
            autocomplete="off"
            value={defaultValue[type]}
            onChange={() => {}}
            iconL={<div>{iconContent}</div>}
          />
        </label>,
      );

      const icon = screen.getByText(iconContent);
      expect(icon).toBeInTheDocument();
    },
  );

  it.each(inputTypes.map((type) => [type]))(
    'should render the expected right icon (%s)',
    (type: InputType) => {
      const iconContent = 'Hello';

      render(
        <label htmlFor="input">
          Input
          <Input
            id="input"
            type={type}
            name="test-input"
            autocomplete="off"
            value={defaultValue[type]}
            onChange={() => {}}
            iconR={<div>{iconContent}</div>}
          />
        </label>,
      );

      const icon = screen.getByText(iconContent);
      expect(icon).toBeInTheDocument();
    },
  );

  it.each(inputTypes.map((type) => [type]))(
    'should render both left and right icons (%s)',
    (type: InputType) => {
      const iconLContent = 'foo';
      const iconRContent = 'bar';

      render(
        <label htmlFor="input">
          Input
          <Input
            id="input"
            type={type}
            name="test-input"
            autocomplete="off"
            value={defaultValue[type]}
            onChange={() => {}}
            iconL={<div>{iconLContent}</div>}
            iconR={<div>{iconRContent}</div>}
          />
        </label>,
      );

      const iconL = screen.getByText(iconLContent);
      const iconR = screen.getByText(iconRContent);

      expect(iconL).toBeInTheDocument();
      expect(iconR).toBeInTheDocument();
    },
  );
});
