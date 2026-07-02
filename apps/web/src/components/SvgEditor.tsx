import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { oneDark } from '@codemirror/theme-one-dark';
import { useIconStore } from '../stores/iconStore';

export function SvgEditor() {
  const svg = useIconStore((state) => state.svg);
  const setSvg = useIconStore((state) => state.setSvg);

  return (
    <CodeMirror
      value={svg}
      height="420px"
      extensions={[xml()]}
      theme={oneDark}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        autocompletion: true,
      }}
      onChange={setSvg}
    />
  );
}
