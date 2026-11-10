---
name: Kalijaga Emerald Academic Intelligence
colors:
  surface: '#011710'
  surface-dim: '#011710'
  surface-bright: '#263e36'
  surface-container-lowest: '#00120c'
  surface-container-low: '#072018'
  surface-container: '#0c241c'
  surface-container-high: '#172e27'
  surface-container-highest: '#223931'
  on-surface: '#cde9dd'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#cde9dd'
  inverse-on-surface: '#1d352d'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#45dfa4'
  on-tertiary: '#003825'
  tertiary-container: '#00b982'
  on-tertiary-container: '#00422c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#68fcbf'
  tertiary-fixed-dim: '#45dfa4'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#011710'
  on-background: '#cde9dd'
  surface-variant: '#223931'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: 4rem
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.75rem
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.625rem
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.45rem
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.05em
  citation-code:
    fontFamily: Space Grotesk
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.25rem
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.75rem
  margin: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
  space-2xl: 3.5rem
---

## Brand & Style

This design system delivers an authoritative, deeply focused scholarly environment tailored for academic research, thesis writing, and strict multi-source verification. Bridging sacred Islamic heritage with cutting-edge artificial intelligence, the visual philosophy marries the introspective depth of midnight forest green with the radiant warmth of noble Kalijaga gold and luminous academic emerald.

The aesthetic fuses **Glassmorphism** with **Technical Precision**:
- **Atmospheric Void:** Deep obsidian greens create a distraction-free visual cocoon that eases cognitive load during extended analysis sessions.
- **Luminous Hierarchy:** Active entities, citations, and synthesis states radiate with soft, coherent emerald bioluminescence, avoiding stark terminal aesthetics in favor of a curated, intellectual salon.
- **Scholarly Rigor:** Dual-pane orchestration treats generated responses and primary texts as co-equal epistemic artifacts, reinforcing integrity, provenance, and critical inquiry over blind automation.

## Colors

The palette draws deeply from traditional Islamic scholastic regalia and modern high-compute interfaces, optimized exclusively for low-light ergonomic concentration:

- **Canvas & Abyssal Bases:** `#041C15` forms the bedrock backdrop, graduated into `#061712` for foundational panels and `#0B2B22` for floating card structures.
- **Primary Scholarly Emerald (`#10B981` & `#059669`):** Represents verified synthesis, interactive actions, confident semantic matches, and computational progress. Its subtle glow guides the researcher through complex dialectical threads.
- **Kalijaga Gold Accent (`#F59E0B` & `#FBBF24`):** A sacred, honorific secondary tone applied sparingly for high-trust badges, primary theological/canon citations, peer-reviewed peer indicators, and primary document bookmarks.
- **Luminous Teal Tones (`#34D399`):** Reserved for real-time streaming tokens, highlighted syntactic annotations, and active query expansion tags.
- **Glass Overlays & Borders:** Rendered via translucent white and emerald blends (`rgba(255, 255, 255, 0.08)` to `rgba(16, 185, 129, 0.15)`), guaranteeing edge sharpness without introducing harsh opaque dividers.

## Typography

Typography centers around **Plus Jakarta Sans** for pristine geometric clarity, generous x-height, and neutral optical balances suited for long-form academic papers, Arabic romanization, and multilingual research.

- **Headlines:** Set with tightened letter-spacing (`-0.02em`) to command structural authority without clinical harshness.
- **Body Text:** Calibrated at `1.625rem` line height for standard paragraph reading, mitigating fatigue when parsing scholarly abstracts or complex jurisprudence arguments.
- **Citations & Metadata:** Utilizes `Space Grotesk` for Turabian/APA reference brackets, query rewrites, and PDF page coordinates to instantly telegraph technical provenance and verifiable data points.

## Layout & Spacing

The system enforces a **Dual-Pane Scholarly Workspace** built upon an adaptive 12-column dynamic framework:

- **Desktop (>=1280px):**
  - Left Workspace (7 columns): Houses the ongoing dialectic flow, prompt reformulation tags, and progressive synthesis cards.
  - Right Verifier (5 columns): Fixed, high-density glass viewport displaying simultaneous PDF excerpts, extracted manuscript pages, and matching similarity-vector heatmaps.
- **Tablet / Split View (768px - 1279px):**
  - Collapsible drawer architecture. The primary pane commands 100% width, while citations trigger a slide-over modal backdrop containing the source snippet.
- **Mobile (<768px):**
  - Single-column continuous scroll. Source verifications render as bottom sheet drawers that swipe up into half-screen inspection modes.
- **Internal Density:** Element-level padding preserves generous 16px to 24px breathing spaces around complex interactive models to maintain composure under heavy data presentation.

## Elevation & Depth

Visual hierarchy is constructed through luminous optical layering rather than opaque structural drop-shadows:

- **Canvas Tier (Lowest):** Matte `#041C15` void punctuated with radial gradients of `#0B2B22` and faint emerald ambient blurs (`filter: blur(140px)`).
- **Glass Panes (Intermediate):** Frosted glass backgrounds (`backdrop-filter: blur(16px) saturate(180%)`) combined with semi-translucent dark fills (`rgba(6, 23, 18, 0.65)`). Borders feature a crisp, singular 1px edge stroke: `rgba(255, 255, 255, 0.08)` on neutral bounds, scaling to `rgba(16, 185, 129, 0.25)` on active panels.
- **Active Focus & Modals (Elevated):** Subtle outward phosphorescence (`box-shadow: 0 0 24px -4px rgba(16, 185, 129, 0.15)`) coupled with Kalijaga gold micro-accents for high-confidence citation verifications.
- **Scroll & Floating Controls:** Floating prompt bars and citation quick-jump widgets leverage high frosted density (`rgba(11, 43, 34, 0.85)`) to maintain legibility across overlapping body text.

## Shapes

The design balances academic seriousness with welcoming, organic intelligence through a cohesive `0.5rem` (`rounded-md`) to `1rem` (`rounded-xl`) curved geometry:

- **Interactive Chips & Citation Badges:** Employs pill-like contours (`rounded-full`) to differentiate conversational metadata and taxonomy tags from primary content blocks.
- **Document & Synthesis Cards:** Uses uniform `rounded-xl` (16px) corners, producing comfortable containment that mirrors high-grade digital leather and modern tablet tablets.
- **Split-Pane Viewport:** Enclosed in continuous rounded inner frames with precise 1px hairline radii, ensuring a seamless visual flow across contrasting analytical viewpoints.

## Components

### 1. Interactive Chat & Citation Stream
- **User Prompt Bubbles:** Deep emerald glass containers (`rgba(11, 43, 34, 0.7)`) aligned right, bounded by a delicate top highlight.
- **Assistant Response Nodes:** Edge-to-edge transparent canvas with an accompanying luminous avatar halo; content utilizes clear typographic rhythm with bolded semantic anchors.
- **Inline Citation Pills:** Pill badges styled as `[1]`, `[Turabian §4.2]`, or author-year strings. Background: `rgba(16, 185, 129, 0.12)`, text: `#34D399`, border: `rgba(16, 185, 129, 0.25)`. Hovering triggers a gold glow (`#F59E0B`) and flashes the corresponding excerpt in the right-hand panel.

### 2. Query Rewriting & Expansion Pills
- Positioned atop response streams to demonstrate transparent RAG retrieval strategies.
- Enclosed within pill shapes featuring subtle dashed borders (`rgba(255, 255, 255, 0.15)`), displaying original query expansions with an emerald spark icon.

### 3. Verification Trust Badges
- **Canon / High-Trust:** Kalijaga Gold fill (`rgba(245, 158, 11, 0.12)`), text `#FBBF24`, 1px gold border. Displays cosine similarity or theological concordance scores.
- **Standard Verified:** Emerald fill (`rgba(16, 185, 129, 0.1)`), text `#10B981`.

### 4. Split-View Source Verifier & PDF Excerpt Panel
- Houses original document snippets with matching yellow/gold text highlighters (`rgba(245, 158, 11, 0.25)`).
- Top navigation includes document switchers, jump-to-page selectors, and an authoritative "Copy Formatted Citation (APA 7 / Turabian)" utility bar.

### 5. Input Console & Prompt Bar
- Suspended frosted bar with integrated multi-modal attachments, voice transcription waves, and a circular submit action button glowing with an active emerald gradient (`linear-gradient(135deg, #10B981, #059669)`).