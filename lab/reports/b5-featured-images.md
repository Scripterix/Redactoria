# Python, Git and curl featured images — generation record

Date: 2026-10-16

## Scope and mode

Three article illustrations were generated with the built-in ImageGen path under
the closed palette and rendering rules in `docs/featured-image-visual-frame.md`.
The Markdown, calculator and API images were style references only, not edit
targets. Accepted opaque 1672×941 PNG sources were center-normalized without
content edits to opaque sRGB WebP, 1600×900, quality 88.

## Final prompt set

### Python fundamentals — base generation

```text
Use case: stylized-concept
Asset type: wide 16:9 editorial article hero and listing thumbnail for a Polish beginner article about Python values, lists, conditions, loops and functions
Input images: Images 1–3 are style, palette, line-quality, texture, detail-density and character-scale references only; they are not edit targets and their compositions or objects must not be copied
Primary request: create a completely new detailed soft-comic story scene in which a small young woman guides a friendly large python snake through four connected learning stations: the snake carries a few simple value tokens from a list-like basket, chooses one of two paths at a branching gate, curls through a loop-shaped track, and delivers a combined result token from a compact function machine
Scene/backdrop: warm off-white imaginative learning garden-workshop with pale sand platforms, a few small rocks, restrained olive plants, tiny white flowers with orange centers and soft beige clouds; the world should invite a longer look while remaining uncluttered
Subject: one full-body young woman about 22–25% of canvas height actively placing a rust-orange token into the first basket; one friendly non-realistic python snake acts as the continuous path through the four stages, mostly muted sky blue with restrained rust-orange and mustard details; the technical journey is the dominant visual mass
Style/medium: exactly the same expanded Redactoria soft editorial comic language as the references: strong slightly hand-drawn charcoal outlines, flat warm color fields, gentle paper texture, shallow soft shadows, charming storybook detail; no photorealism and no glossy 3D
Composition/framing: wide landscape with a clear left-to-right four-stage journey, concept occupies 60–70% of visual mass, character secondary, all important action inside a thumbnail-safe central area, strong readable silhouette at small card size
Lighting/mood: bright, curious, friendly, clever and playful
Color palette: CLOSED PALETTE ONLY — warm ivory/off-white, charcoal/near-black, burnt orange/rust/restrained coral, pale beige/sand/warm gray, muted sky blue, soft mustard yellow, muted olive green; rust and charcoal remain dominant; green only in plants; do not introduce any other hue family
Constraints: exactly one human character and one friendly snake; show values/lists, branch, loop and returned result through shapes only; no readable words, letters, digits, code or Python logo; no trademarks; no watermark; no border; opaque background; correct natural human anatomy and hands; snake anatomy simple and charming, never threatening
Avoid: new colors, purple, saturated pink, neon cyan, vivid primary red, realistic reptile, jungle scene, classroom, giant human, copied reference layouts, dense diagram labels, extra people
```

The base result contained two snake heads and was rejected. The accepted source
was produced by this single targeted correction:

```text
Use case: precise-object-edit
Asset type: wide 16:9 editorial article hero
Input images: Image 1 is the edit target
Primary request: fix the snake anatomy so the illustration contains exactly one continuous python snake with exactly one head; keep the head near the right-side loop and function machine, and replace the extra left-side head beside the basket with the same snake's gently tapering tail emerging from the basket and continuing naturally through the branch and loop
Constraints: change only the extra left snake head and the immediately necessary connecting body; keep the entire composition, young woman, pose, hands, machines, tokens, arrows, loop, plants, flowers, rocks, clouds, linework, texture, shadows and CLOSED PALETTE unchanged; preserve the exact 16:9 framing; no new objects, colors, text, logos or characters; no watermark
```

### Local Git

```text
Use case: stylized-concept
Asset type: wide 16:9 editorial article hero and listing thumbnail for a Polish beginner article about local Git working tree, staging, commit and history
Input images: Images 1–3 are style, palette, line-quality, texture, detail-density and character-scale references only; they are not edit targets and their compositions or objects must not be copied
Primary request: create a completely new detailed soft-comic story scene of a small young man operating a physical version-control workshop with three visually distinct stages: a working desk where one file card is being changed, a raised staging platform where selected file cards wait neatly, and a branching history tree or rail where sealed snapshot cards appear as permanent commit nodes
Scene/backdrop: warm off-white imaginative local workshop-garden with pale sand floor, compact shelves, a few small rocks, restrained olive plants, tiny white flowers with orange centers and soft beige clouds; detailed enough to reward a longer look but clean and organized
Subject: one full-body young man about 22–25% of canvas height actively moving a rust-orange changed file card from the work desk onto the staging platform; a small lever or snapshot press transfers the staged group onto a branching history structure with several past nodes and one short alternate branch; no remote cloud, network or external service
Style/medium: exactly the same expanded Redactoria soft editorial comic language as the references: strong slightly hand-drawn charcoal outlines, flat warm color fields, gentle paper texture, shallow soft shadows, charming storybook detail; no photorealism and no glossy 3D
Composition/framing: wide landscape with a clear left-to-right working desk → staging platform → permanent history journey; conceptual environment occupies 60–70% of visual mass; character secondary; important action inside a thumbnail-safe central area; strong silhouette at small card size
Lighting/mood: bright, methodical, satisfying, friendly and inventive
Color palette: CLOSED PALETTE ONLY — warm ivory/off-white, charcoal/near-black, burnt orange/rust/restrained coral, pale beige/sand/warm gray, muted sky blue, soft mustard yellow, muted olive green; rust and charcoal remain dominant; muted sky blue limited to a few staged cards or one small mechanism; green only in plants; do not introduce any other hue family
Constraints: exactly one human character; visually distinguish unselected working changes, selected staged cards and permanent history snapshots through placement and shapes only; no readable words, letters, digits, code, Git logo or GitHub imagery; no trademarks; no watermark; no border; opaque background; correct natural anatomy and hands
Avoid: new colors, purple, saturated pink, neon cyan, vivid primary red, remote server, cloud upload, octopus mascot, literal software screenshot, giant human, copied reference layouts, dense labels, extra people
```

### curl and HTTP

```text
Use case: stylized-concept
Asset type: wide 16:9 editorial article hero and listing thumbnail for a Polish beginner article about curl, HTTP response status, headers and local JSON body
Input images: Images 1–3 are style, palette, line-quality, texture, detail-density and character-scale references only; they are not edit targets and their compositions or objects must not be copied
Primary request: create a completely new detailed soft-comic story scene in which a small young woman operates a terminal control desk connected to a compact local server by one prominently curled pneumatic cable; she sends a small request capsule through the cable, and a returning response pod opens near her into three visually distinct compartments representing a status signal, a stack of header cards and one geometric JSON-like body parcel
Scene/backdrop: warm off-white imaginative local communications workshop with pale sand platforms, one terminal screen with abstract lines only, a compact server cabinet, a coiled transparent-muted-blue and rust-orange cable, small rocks, restrained olive plants, tiny white flowers with orange centers and soft beige clouds; detailed enough to reward a longer look without clutter
Subject: one full-body young woman about 22–25% of canvas height actively opening or inspecting the returned response pod beside the terminal; the large curled cable forms the memorable central silhouette; request and response travel in opposite lanes or directions through the same connection; a small amber checkpoint may indicate an unsuccessful HTTP response without any digits or labels
Style/medium: exactly the same expanded Redactoria soft editorial comic language as the references: strong slightly hand-drawn charcoal outlines, flat warm color fields, gentle paper texture, shallow soft shadows, charming storybook detail; no photorealism and no glossy 3D
Composition/framing: wide landscape with terminal and character at one end, large curled cable across the center and local server at the other end; conceptual environment occupies 60–70% of visual mass; character secondary; important action inside a thumbnail-safe central area; strong silhouette at small card size
Lighting/mood: bright, exploratory, friendly, precise and satisfying
Color palette: CLOSED PALETTE ONLY — warm ivory/off-white, charcoal/near-black, burnt orange/rust/restrained coral, pale beige/sand/warm gray, muted sky blue, soft mustard yellow, muted olive green; rust and charcoal remain dominant; blue belongs to the cable glass and data flow; yellow only to small signals; green only in plants; do not introduce any other hue family
Constraints: exactly one human character; clearly show terminal → curled connection → local server → returned response with three parts using shapes only; no readable words, letters, digits, commands, URLs, code, curl logo or external brand; no trademarks; no watermark; no border; opaque background; correct natural anatomy and hands
Avoid: new colors, purple, saturated pink, neon cyan, vivid primary red, internet globe, remote cloud, literal delivery vehicle, copied API island composition, giant human, dense labels, extra people
```

## Accepted artifacts

| Article | Built-in source | Final asset | Bytes | SHA-256 |
| --- | --- | --- | ---: | --- |
| Python fundamentals | `exec-b2acbb02-c408-402d-bb52-97e6c112e0e5.png` | `src/assets/podstawy-pythona.webp` | 138,902 | `7131b1933ef96acb16f14e40cadab9f3ee1e0db218ea1baddcb41892a3770a13` |
| Local Git | `exec-f6c02488-c03a-4024-b74f-eb47ad0eecf1.png` | `src/assets/git-lokalnie.webp` | 138,766 | `6db148a064eaf5eb51b2ac17dc346c62c118696090b501298a2a20d73076b5f4` |
| curl / HTTP | `exec-59a757fa-3bbe-4095-b09c-b8b2b9fcd86a.png` | `src/assets/curl-http.webp` | 169,854 | `f08424baa31e675b3cdb1f66a4fc121a0b93ab517075f0b0567f6b7b2013a734` |

## Visual acceptance

- Python uses one continuous friendly snake after the targeted correction; values,
  branch, loop and returned result form one readable journey.
- Git separates working changes, staging, the commit press and branching history
  without implying a remote service.
- curl separates the terminal, local server, two transfer directions and the
  returned status/header/body compartments.
- All three remain inside the frozen color families and rendering language. No new
  accent hue, readable prose, watermark, malformed anatomy or unsafe crop remains.
