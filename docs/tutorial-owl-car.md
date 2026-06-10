# OWL Tutorial — a Car as a Compound Graph in OWL

A hands-on walkthrough using ArchiCG's bundled **Car** sample model: load it, look at the composite/compound duality, export it to OWL, and run a reasoner to derive `partOf` relationships from a chain of composition edges.

The OWL exporter writes JSON-LD in a hybrid shape: it emits ArchiCG's reified edge-individuals (where each edge has its own URI for provenance) **alongside** direct triples that any standard reasoner can use without preprocessing.

## What you'll learn

- How ArchiCG's two graph abstractions (compound and composite) map onto OWL.
- How the OWL exporter encodes nodes, edges, properties, and types as JSON-LD.
- Why each edge becomes its own `owl:NamedIndividual` ("graph elements are first-class") rather than a direct triple — and what that means for reasoning.
- How to add a small companion ontology so Protégé can infer `partOf` over a chain of composition relationships.

## Prerequisites

- ArchiCG opened locally. Open `ArchiCG Viewer and Analyzer.html` in Chrome.
- [Protégé](https://protege.stanford.edu/) (free) installed, or any OWL reasoner you prefer (HermiT, Pellet, ELK).
- A text editor for inspecting the exported JSON-LD.

## 1. Load the Car

In the top menu choose **Tools → Car (Tutorial)**, then click **Load Data Demo** in the Tool panel on the left.

The graph now contains **53 nodes** (a `Car`, eight systems beneath it, and dozens of subcomponents) connected by **52 composition edges**. Every node is typed `product`; every edge is typed `composition`.

## 2. The composite/compound duality

This step builds intuition for the OWL export. The same containment fact can be displayed two ways.

- **As edges.** `Car ── composition ──→ EngineSystem`. The edge is visible, both endpoints are sibling nodes.
- **As nesting.** `EngineSystem` lives inside `Car` as a child compound. No edge — the containment is structural.

Try this:

1. **Compound Graph → Collapse all nodes** — the whole car folds into a single node.
2. **Compound Graph → Expand all nodes** — everything unfolds.
3. Select the `Car` node, then **Composite Graphs → Selected graph to compound** — the composition edges between `Car` and the eight systems disappear; the systems become children of `Car`.
4. With `Car` still selected, **Composite Graphs → Selected compound to graph** — the nesting unwinds back into explicit edges.

Why this matters for OWL: **the export uses the edge form**. Composition is serialized as a relationship object, not as ontology-level nesting. Run `Compound Graph → Expand all nodes` once more so every edge is visible before exporting.

## 3. Export the model to OWL

Choose **File → Export → OWL**. The filename prompt defaults to `archicg.owl`; rename it to `car.owl` and accept.

By default the exporter honors the current selection — if you've selected a subset of the graph, only those nodes and edges are written. If nothing is selected, ArchiCG exports the whole graph and shows a confirmation that lists the counts. For this tutorial just leave the selection empty and let ArchiCG export all 53 nodes / 52 edges.

The exporter derives the model namespace from the filename: `car.owl` ⇒ `http://www.archicg.net/car#…`. Every individual in your file will live under that namespace.

## 4. What's in the file

The exporter writes JSON-LD in expanded form (full IRIs everywhere, no `@context` block). The output is a JSON array containing five kinds of objects: the ontology header, one property declaration per edge type used, one object per node, one object per reified edge, and one object per direct triple. For the Car export that totals **159 objects**: 1 header + 1 property declaration + 53 nodes + 52 reified edges + 52 direct triples.

### 4.1 The ontology header

```json
{
  "@id": "_:genid1",
  "@type": ["http://www.w3.org/2002/07/owl#Ontology"],
  "http://www.w3.org/2002/07/owl#imports": [
    { "@id": "http://www.plm-interop.net/archimate/basic/3.1" }
  ]
}
```

This declares the file is an OWL ontology and imports a base vocabulary `http://www.plm-interop.net/archimate/basic/3.1`. That IRI is part of ArchiCG's interop vocabulary and isn't currently resolvable on the public web — Protégé will warn about a missing import. You can either remove the import line for now or supply the vocabulary as a local file. We'll do the latter in §6.

### 4.2 Property declarations

For each ArchiMate edge type present in the export, the exporter declares an `owl:ObjectProperty` at `http://www.plm-interop.net/archimate/relations/<edgeType>` (singular, no `_from` / `_to` suffix). For edge types that are transitive by the ArchiMate specification — `composition`, `aggregation`, `specialization` — `owl:TransitiveProperty` is also asserted. The Car model contains only composition edges, so you get one declaration:

```json
{
  "@id": "http://www.plm-interop.net/archimate/relations/composition",
  "@type": [
    "http://www.w3.org/2002/07/owl#ObjectProperty",
    "http://www.w3.org/2002/07/owl#TransitiveProperty"
  ]
}
```

This is what lets the reasoner work over the direct triples in §4.5 without any custom rules.

### 4.3 A node — the `Car`

```json
{
  "@id": "http://www.archicg.net/car#Car",
  "@type": [
    "http://www.w3.org/2002/07/owl#NamedIndividual",
    "http://www.plm-interop.net/archimate/basic/product"
  ],
  "http://www.w3.org/2000/01/rdf-schema#label": [{ "@value": "Car" }],
  "http://www.plm-interop.net/archimate/properties/id": { "@value": "Car" },
  "http://www.plm-interop.net/archimate/properties/type": { "@value": "product" },
  "http://www.plm-interop.net/archimate/properties/label": { "@value": "Car" }
}
```

Notice that the Cytoscape `type` field (`product`) appears in two places: as an OWL type IRI (`archimate/basic/product`) *and* as a string property under `archimate/properties/type`. This is intentional in the exporter — every Cytoscape data field is reflected as an `archimate/properties/<key>` literal, even when the same information is already represented structurally. The same applies to `id` and `label`.

### 4.4 A reified edge — `Car ── composition ──→ EngineSystem`

```json
{
  "@id": "http://www.archicg.net/car#edge6",
  "@type": [
    "http://www.w3.org/2002/07/owl#NamedIndividual",
    "http://www.plm-interop.net/archimate/basic/composition"
  ],
  "http://www.plm-interop.net/archimate/relations/composition_from": [
    { "@id": "http://www.archicg.net/car#Car" }
  ],
  "http://www.plm-interop.net/archimate/relations/composition_to": [
    { "@id": "http://www.archicg.net/car#EngineSystem" }
  ],
  "http://www.plm-interop.net/archimate/properties/id": { "@value": "edge6" },
  "http://www.plm-interop.net/archimate/properties/edgeType": { "@value": "composition" },
  "http://www.plm-interop.net/archimate/properties/source": { "@value": "Car" },
  "http://www.plm-interop.net/archimate/properties/target": { "@value": "EngineSystem" }
}
```

The crucial point: **the edge itself is an `owl:NamedIndividual`**, not just a triple. Its source and target are expressed through two predicates whose names encode the edge type — `composition_from` and `composition_to`.

This is *reification* — the act of turning a relationship into a thing you can refer to. ArchiCG's choice trades the brevity of a direct triple for a per-edge URI you can attach provenance, source-system metadata, or transformation rules to. That matters for interop work where the same logical edge may exist with different metadata in PLM, ERP, and MOM repositories you're aggregating.

### 4.5 The direct triple — what makes the reasoner happy

Reified edges alone are awkward for a standard reasoner. So the exporter *also* emits a plain direct triple for each edge, using the singular `composition` predicate declared in §4.2:

```json
{
  "@id": "http://www.archicg.net/car#Car",
  "http://www.plm-interop.net/archimate/relations/composition": [
    { "@id": "http://www.archicg.net/car#EngineSystem" }
  ]
}
```

In JSON-LD, an object with an existing `@id` adds to (rather than replaces) the entity declared earlier. So this object is read as "in addition to everything we already know about `:Car`, it also has a `composition` link to `:EngineSystem`."

You now have the same fact in two forms in the same file:

- the *reified* form (`:edge6 a NamedIndividual ; composition_from :Car ; composition_to :EngineSystem`) — for provenance and per-edge metadata
- the *direct* form (`:Car composition :EngineSystem`) — for reasoning

Standard OWL reasoners see the direct triples and, because composition is declared transitive in §4.2, infer the closure automatically. The companion ontology in §6 only needs to set up a couple of conveniences and stub the missing import — no SWRL rule, no bridge.

## 5. Open in Protégé

1. Launch Protégé.
2. **File → Open → car.owl**. Protégé warns about the missing import — dismiss for now.
3. Open the **Individuals** tab. You should see all 60 product individuals plus all 52 edge individuals.
4. Click `edge6` to see its asserted `composition_from` (Car) and `composition_to` (EngineSystem) values.
5. Click `Piston` (under the engine) — you'll see only its asserted edges. No `partOf` yet.

## 6. A small companion ontology

The exported file is reasoner-ready *except* for the missing import. Create a file `car-companion.ttl` alongside `car.owl`:

```turtle
@prefix owl:   <http://www.w3.org/2002/07/owl#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix archi: <http://www.plm-interop.net/archimate/relations/> .
@prefix base:  <http://www.plm-interop.net/archimate/basic/> .
@prefix :      <http://www.archicg.net/car-companion#> .

# Stub the imported base vocabulary so Protégé stops complaining.
<http://www.plm-interop.net/archimate/basic/3.1> a owl:Ontology .
base:product     a owl:Class .
base:composition a owl:Class .

# Convenience: expose the inverse direction (partOf) for readability.
# This is optional — reasoning over composition alone is enough.
:partOf a owl:ObjectProperty ;
        owl:inverseOf archi:composition .
```

Two things this file does:

1. **Stubs the missing import.** Declares the `archimate/basic/3.1` ontology and its `product` / `composition` classes so Protégé doesn't error on the import in `car.owl`.
2. **Exposes a `partOf` inverse.** Optional, purely for readability — without it the reasoner only reports inferences in the `composition` direction, which is whole→part. With it, every inference shows up in both directions on the individuals.

Load `car-companion.ttl` into Protégé via **File → Open** *while car.owl is already open*; the two files form a single workspace.

## 7. Run the reasoner and see the payoff

1. **Reasoner → Select reasoner → HermiT** (or ELK / Pellet).
2. **Reasoner → Start reasoner**.
3. After a couple of seconds the inferred view turns on. Click `Piston` in the Individuals list.
4. In the right-hand "Property assertions" pane, look under **partOf (inferred)**. You should see `Car`, `EngineSystem`, `EngineBlock`, `Cylinder` — Piston is transitively a part of all of them.

What the reasoner did:

1. It read the direct triples from §4.5 (`:Car composition :EngineSystem`, `:EngineSystem composition :EngineBlock`, and so on).
2. Because `composition` is declared as `owl:TransitiveProperty` in §4.2, the reasoner closed the 4-hop chain `Car ─ composition ─ EngineSystem ─ composition ─ EngineBlock ─ composition ─ Cylinder ─ composition ─ Piston` into the direct inferred triple `Car composition Piston`.
3. The companion ontology defines `:partOf owl:inverseOf archi:composition`, so the same fact is reported on `Piston` in the inverse direction: `Piston partOf Car`.

This is the moment the ontology earns its keep: a four-hop chain in the graph becomes one inferred relationship without your having to write any explicit traversal code or SWRL rule. The reified edge-individuals from §4.4 are still in the file — readers and downstream tools that need per-edge provenance can use them — but the reasoner doesn't have to look at them.

## 8. Round-trip back into ArchiCG

The file you just exported can be re-imported. **File → Import → OWL (JSON-LD)** opens a file picker; pick `car.owl` and confirm "Replace" when prompted. The graph clears and rebuilds from the JSON-LD. Spot-check: open the bottom panel, double-click any node — the imported `id`, `label`, and `type` round-trip identically.

The importer reads ArchiCG's hybrid export shape: it skips the ontology header and property declarations, splits `NamedIndividual` objects into nodes vs reified edges by looking for `<edgeType>_from` / `<edgeType>_to` predicates, and ignores the direct-triple sidecar entries (the relationships have already been reconstructed from the reified form). Foreign JSON-LD that does *not* follow this convention won't import cleanly — that's a future job.

## 9. What this tutorial doesn't do (yet)

- **No type taxonomy.** All products share the same type. A richer example would distinguish `Engine`, `Wheel`, `Brake`, etc., and let the reasoner classify instances. Future tutorial fodder.
- **No SHACL.** Validation constraints over the model (e.g. "every part of an `EngineSystem` must be of type `EngineComponent`") are out of scope here but a natural follow-on.
- **No Turtle / RDF/XML.** Only JSON-LD is parsed. Adding Turtle would mean wiring up `lib/vendor/jsonld.min.js` properly (it's bundled but unused) or vendoring a Turtle parser.

## 10. A note on ArchiCG's design

The reified-edge encoding looks unusual against textbook OWL but is consistent across his work. In `js/cytoscape/predefinedGraphs.js` (a separate Ontology Viewer code path), OWL properties are represented as *nodes* rather than predicate labels, with statements about them (`rdfs:domain`, `rdfs:range`, `rdfs:subPropertyOf`, `owl:inverseOf`) expressed as edges. Treating every graph element as a first-class entity with its own URI is the through-line.

The pragmatic case for it: in interoperability work, you frequently need to talk *about* a relationship — its provenance, when it was asserted, by which source system, with what confidence — and giving each edge its own URI gives you somewhere to hang that. The cost is a layer of indirection that hides reasoning from standard OWL until you bridge it (as we just did with SWRL).
