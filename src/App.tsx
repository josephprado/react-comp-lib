import './App.css';
import { SkipNavDemo } from './skip-nav-demo/skip-nav-demo';
import { OutsideClickHandlerDemo } from './outside-click-handler-demo/outside-click-handler-demo';
import { ButtonDemo } from './button-demo/button-demo';
import { InputDemo } from './input-demo/input-demo';
import { TableDemo } from './table-demo/table-demo';
import { ExpandingContextDemo } from './expanding-context-demo/expanding-context-demo';

function App() {
  return (
    <div id="demos">
      {/* FIXME: SkipNavDemo must be first, or else it won't work. */}
      <SkipNavDemo containerId="demos" />
      <OutsideClickHandlerDemo />
      <ButtonDemo />
      <InputDemo />
      <TableDemo />
      <ExpandingContextDemo />
    </div>
  );
}

export default App;
