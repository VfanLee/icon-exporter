import CodeMirror from '@uiw/react-codemirror'
import { xml } from '@codemirror/lang-xml'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import { useEffect, useRef, useState } from 'react'
import { useIconStore } from '../stores/iconStore'

export function SvgEditor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [editorHeight, setEditorHeight] = useState(0)
  const svg = useIconStore((state) => state.svg)
  const setSvg = useIconStore((state) => state.setSvg)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const updateHeight = () => {
      const nextHeight = container.getBoundingClientRect().height
      if (nextHeight > 0) {
        setEditorHeight(Math.floor(nextHeight))
      }
    }

    updateHeight()

    const observer = new ResizeObserver(() => {
      updateHeight()
    })
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="workspace-editor">
      {editorHeight > 0 ? (
        <CodeMirror
          value={svg}
          height={`${editorHeight}px`}
          extensions={[xml(), EditorView.lineWrapping]}
          theme={oneDark}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            autocompletion: true,
          }}
          onChange={setSvg}
        />
      ) : null}
    </div>
  )
}
