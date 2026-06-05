# ArchiCG

Browser-based viewer and analyzer for ArchiMate models, built on two graph abstractions: **compound graphs** and **composite graphs**. Static HTML — no build, no server, open one file.

![Expand and collapse compound nodes](img/ArchiCGWorksheet/WelcomeArchiCGExpandandCollapse.gif)

## What it is

- A graph-operations tool for ArchiMate models. You analyze, slice, and transform existing models more than you author from scratch.
- Reads ArchiMate Open Exchange Format XML, plus exports from Archi (jArchi script) and Enterprise Architect.
- Runs in any modern browser. The whole app is one HTML file plus JavaScript — no install, no server.
- A research incubator and proof-of-concept by Dr. Nicolas Figay, intended to complement Archi and Enterprise Architect rather than replace them.

## What it is not

- A drawing tool. Authoring (palette → Create Node, Edge Draw) is supported but secondary.
- A repository or collaboration platform. Save/load is to local `.archicg` files.

## Two graph abstractions

ArchiCG treats your model as a typed graph and adds two structural views on top of it:

**Compound graph.** Nodes can contain other nodes. Any compound can be collapsed to summarize a sub-structure or expanded to drill in, and multiple edges between the same pair of nodes can be bundled into one collapsed edge and unbundled on demand.

**Composite graph.** When edges carry composition semantics (the ArchiMate composition relationship), the same data can be displayed *either* as edges in the graph *or* as compound nesting — and flipped between the two representations on the fly. Containment becomes a view, not a fixed structural choice.

The bundled **Car** sample (`Tools → Car → Load Data Demo`) is the textbook example: 53 product nodes connected by 52 composition edges in a pure parent-of-parts tree. Use it to see compound nesting and the composite-to-edges flip side by side without any other modeling vocabulary getting in the way.

Most of ArchiCG's analytical operations — filter, color-by-property, matrix view, neighborhood traversal, shortest path, automated layout — run against these structures, not against a flat diagram.

## What you can do with them

- **Compound Graph menu** — collapse/expand all or selected nodes, add a compound around a selection, remove a compound, add nesting, collapse/expand edges.
- **Composite Graphs menu** — selected-compound-to-graph and back, create a child component, show/hide composition edges.
- **Tools menu** — filter by ArchiMate viewpoint, traverse neighborhoods and shortest paths, compute node degrees, color the graph by any property value, render as an adjacency matrix, project onto a timeline.

See `docs/ArchiCGViewer and Analyser - User Guide.pdf` for the full command catalog.

## UI at a glance

The window is a four-pane w2ui layout; each pane is a host for graph operations.

- **Center** — the Cytoscape graph. Click to select, double-click to populate the properties panel, drag to move, expand or collapse compounds in place.
- **Left** — the *Tool panel*. Defaults to ArchiCGEditor (Create Node, bulk-create with iterator, Tag, Filter Expression, Hide/Delete). Swaps content when you pick a different tool from the Tools menu.
- **Right** — the *Palette*. ArchiMate icons grouped by layer (Strategy, Business, Application, Technology & Physical, Motivation, Implementation & Migration). Double-click an icon to set the active node or edge type.
- **Bottom** — *Properties / Entity Attributes*. Double-click any node or edge to populate. A chevron at the right collapses the panel to a slim strip when you want full graph height.
- **Top menu** — cross-pane operations: File, Compound Graph, Composite Graphs, Graph Manipulation, Palettes, Tools, Parameters, ArchiCG.

## Quick start

1. Clone or download this repository.
2. Open `ArchiCG Viewer and Analyzer.html` in Chrome (or any recent Chromium-based browser). `file://` is fine — no server required.
3. The bundled default graph loads — it is the ArchiCG self-model defined in `lib/initialgraph.js`. Drag nodes around, double-click a compound to expand or collapse it, double-click any node to see its properties at the bottom.
4. Try `Compound Graph → Collapse all nodes`, then `Expand all nodes`. Then `Composite Graphs → Selected compound to graph` on a compound to flip its composition from nesting to explicit edges.
5. Save via `File → Save` (downloads a `.archicg` JSON file you can reload later).

For a less abstract first model, choose **Tools → Car** then click **Load Data Demo** in the left Tool panel — that swaps in a 53-node car decomposition (a clean pure-composition graph) and pairs naturally with the workflow recipes below.

To build a model from scratch: empty the canvas (`Graph Manipulation → Delete → All`), double-click a palette icon to pick a type, click **Create Node** in the left Tool panel, then switch to **Edge Draw** to connect nodes.

## Importing your data

ArchiCG accepts data through `File → Load` and `File → Import`:

| Source | Menu | Notes |
|---|---|---|
| ArchiCG native | Load `.archicg` (Cytoscape JSON) | Round-trips losslessly. |
| Archi | Import jArchiCG | Requires a jArchi script to produce the JSON export. |
| ArchiMate Open Exchange Format | Import OEF XML | Standard XML defined by The Open Group. |
| OWL / JSON-LD | Import OWL (JSON-LD) | Round-trips ArchiCG's own OWL export; see `docs/tutorial-owl-car.md`. |
| Alfabet (entities / attributes / relations) | Import | CSV-based, three separate menu items. |
| OneCompass | Import | Multi-file. |

Export targets: `.archicg`, ArchiMate OEF XML, OWL, CSV, PNG/JPG/SVG. See the User Guide "File menu" section for the full matrix.

## Common workflows

**Focus on a sub-structure.** Select a compound → `Compound Graph → Collapse selected recursively` → re-run the layout (`Tools → Fcose`) to see only the relevant parent context.

**Flip containment between nesting and edges.** With the Car demo loaded, select the `Car` node → `Composite Graphs → Selected graph to compound` folds all eight systems into nested compounds. Select it again → `Composite Graphs → Selected compound to graph` unfolds them back into explicit composition edges. Same data, two views.

**Color by a property.** `Tools → ColoredMap` → pick a property name. ArchiCG generates a color legend and recolors nodes by their value for that property — useful for spotting clusters in a large model.

**Filter by ArchiMate viewpoint.** `Tools → Viewpoints` → pick a viewpoint to restrict the palette and hide non-relevant elements. Lets you produce a stakeholder-specific view from a single source model.

**Filter with a selector expression.** In the Tool panel, type a Cytoscape selector like `node[type = "business-actor"]` into Filter Expression. Full selector syntax is in the User Guide "Filtering with filter expression" section.

## Tools — one-liners

- **ArchiCGEditor** — default editor: Create Node, bulk-create, Tag, Filter, Hide/Delete.
- **ACGTraversal** — neighborhood, roots/leaves, shortest path.
- **ACGDegrees** — compute in/out/total degrees.
- **ColoredMap** — color nodes by a property value, auto-legend.
- **Colouring** — apply a single color to a selection or tag.
- **Viewpoints** — restrict palette and visibility to an ArchiMate viewpoint.
- **Graph as Matrix** — adjacency-matrix view (alpha).
- **Fcose** — compound-aware automated layout with parameters.
- **Timeline** — project nodes with date properties onto a timeline (alpha).
- **URL Navigation** — open URLs declared on nodes.
- **Pivot Table** — produce pivot tables from graph data.
- **Car** — sample dataset, not an operation: loads a 53-node product decomposition of a car. Pure mereology (every edge is `composition`, every node is `product`). Used as the worked example throughout the OWL tutorial and as the cleanest small demo of compound/composite operations.

## Architecture notes

No build step. Entry point `ArchiCG Viewer and Analyzer.html` loads everything via `<script>` tags; `package.json` exists only for ESLint.

- **Main app code** — `lib/ArchiCGViewerAndAnalyzer.js` (layout, menus, event wiring, import/export).
- **Default initial graph** — `lib/initialgraph.js`.
- **Per-tool modules** — `lib/tool*.js`, one per Tools menu entry.
- **Modeling-language palettes** — `lib/archimate.js`, `lib/paletteArchiMate.js`, `lib/dmn.js`, `lib/complexity.js`.
- **Vendored dependencies** — under `lib/vendor/`: Cytoscape.js plus extensions (fcose, expand-collapse, undo-redo, edgehandles, compound-drag-and-drop), w2ui-2.0, D3, vis-timeline, JSZip, FileSaver, sweetalert, PivotTable.js.

## Documentation

- `docs/ArchiCGViewer and Analyser - User Guide.pdf` — full reference, command-by-command.
- `docs/ArchiCGWorksheet.pdf` — illustrated walkthrough.
- `docs/tutorial-owl-car.md` — OWL/JSON-LD walkthrough using the bundled Car demo: export, reason over composition with Protégé, round-trip back into ArchiCG.
- Wiki: <https://github.com/nfigay/ArchiCG/wiki>
- Landing page: <https://nfigay.github.io/archicg/>

## License and authors

See `LICENSE` and `AUTHORS`. Contact: Dr. Nicolas Figay (<nicolas.figay@gmail.com>).
