import './App.css';
import { SkipNavDemo } from './skip-nav-demo/skip-nav-demo';
import { OutsideClickHandlerDemo } from './outside-click-handler-demo/outside-click-handler-demo';
import { TableDemo } from './table-demo/table-demo';
import { FormatTelUSADemo } from './format-tel-usa-demo/format-tel-usa-demo';
import { ModalDemo } from './modal-demo/modal-demo';
import { UseDataEditingDemo } from './use-data-edtiting-demo/use-data-editing-demo';
import { UseFilteringDemo } from './use-filtering-demo/use-filtering-demo';
import { UseWizardDemo } from './use-wizard-demo/use-wizard-demo';

function App() {
  return (
    <div id="demos">
      {/* FIXME: SkipNavDemo must be first, or else it won't work. */}
      <SkipNavDemo containerId="demos" />
      <OutsideClickHandlerDemo />
      <TableDemo />
      <FormatTelUSADemo />
      <ModalDemo />
      <UseDataEditingDemo />
      <UseFilteringDemo />
      <UseWizardDemo />
    </div>
  );
}

export default App;
