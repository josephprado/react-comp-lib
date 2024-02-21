import './App.css';
import { SkipNavDemo } from './skip-nav-demo/skip-nav-demo';
import { OutsideClickHandlerDemo } from './outside-click-handler-demo/outside-click-handler-demo';
import { TableDemo } from './table-demo/table-demo';
import { ExpandingContextDemo } from './expanding-context-demo/expanding-context-demo';
import { DataEditingContextDemo } from './data-editing-context-demo/data-editing-context-demo';
import { WizardContextDemo } from './wizard-context-demo/wizard-context-demo';
import { FormatTelUSADemo } from './format-tel-usa-demo/format-tel-usa-demo';

function App() {
  return (
    <div id="demos">
      {/* FIXME: SkipNavDemo must be first, or else it won't work. */}
      <SkipNavDemo containerId="demos" />
      <OutsideClickHandlerDemo />
      <TableDemo />
      <ExpandingContextDemo />
      <DataEditingContextDemo />
      <WizardContextDemo />
      <FormatTelUSADemo />
    </div>
  );
}

export default App;
