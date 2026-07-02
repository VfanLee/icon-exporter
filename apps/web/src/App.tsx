import { lazy, Suspense } from 'react'

const ExportButton = lazy(() =>
  import('./components/ExportButton').then((module) => ({
    default: module.ExportButton,
  })),
)
const ExportSettings = lazy(() =>
  import('./components/ExportSettings').then((module) => ({
    default: module.ExportSettings,
  })),
)
const SvgEditor = lazy(() =>
  import('./components/SvgEditor').then((module) => ({
    default: module.SvgEditor,
  })),
)
const SvgPreview = lazy(() =>
  import('./components/SvgPreview').then((module) => ({
    default: module.SvgPreview,
  })),
)
const SvgUploader = lazy(() =>
  import('./components/SvgUploader').then((module) => ({
    default: module.SvgUploader,
  })),
)

function PanelFallback() {
  return <div className="panel-fallback">Loading...</div>
}

export default function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="app-title">icon-exporter</h1>
          <p className="app-subtitle">Local SVG preview, validation, and multi-format export.</p>
        </div>
        <Suspense fallback={<PanelFallback />}>
          <ExportButton />
        </Suspense>
      </header>

      <section className="app-content">
        <div className="content-grid">
          <div className="main-column">
            <section className="panel">
              <h2 className="panel-title">SVG source</h2>
              <div className="panel-content stack">
                <Suspense fallback={<PanelFallback />}>
                  <SvgUploader />
                </Suspense>
                <Suspense fallback={<PanelFallback />}>
                  <SvgEditor />
                </Suspense>
              </div>
            </section>

            <section className="panel">
              <h2 className="panel-title">Preview</h2>
              <div className="panel-content">
                <Suspense fallback={<PanelFallback />}>
                  <SvgPreview />
                </Suspense>
              </div>
            </section>
          </div>

          <aside className="side-column">
            <section className="panel">
              <h2 className="panel-title">Export settings</h2>
              <div className="panel-content">
                <Suspense fallback={<PanelFallback />}>
                  <ExportSettings />
                </Suspense>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}
