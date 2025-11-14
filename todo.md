Add single player mode and an ai mode
Make it so the landsacpe can pan to the left and right and add a few additional games like an arcade wit pong and stuff.

# Dark Mode Mini‑Game: Starry Zen (Static)

## Scope

- One peaceful scene under the stars with optional sub-activities:
- Stargazing scope with local (hardcoded) star facts; no network.
- Windchimes on a fence plus ambient night loop, with mute toggle.
- Fireflies you can catch with a net and place in a glowing jar.
- Cozy house on the right; enter to a simple interior stub for future games.
- Calm, no fail state. Minimal HUD with held item and controls.

## Systems & Features

1) Stargazing (Sky)

- Move a scope ring over the sky; scroll/Q/E to zoom (x1–x4).
- Lock onto nearest bright star within radius; show a small card with a random local fact from `data/starFacts.json`.
- Optional constellation hints (later).

2) Windchimes & Ambient

- 3–5 chimes on the fence; gentle breeze triggers soft chime tones.
- Ambient night audio loop (lofi cricket/wind) with M mute toggle.
- Optional: reposition/tune chimes (simple preset pitches).

3) Fireflies & Jar

- Fireflies wander slowly; attracted to player proximity.
- Net pickup from ground; interact near firefly to catch; interact near jar to deposit (jar glow increments); release option.

4) Cozy House

- Parallax house at right; door hotspot toggles to an interior scene (stub view with “Return outside”).

5) HUD & Controls

- Toolbar shows held item (scope, net, jar) and scope zoom level.
- Controls: A/D or Arrow keys move; E/Enter interact; Q/E or wheel to zoom; M mute.

## Static Data

- `data/stars.json`: fixed 20–50 bright star positions (screen coords) with names.
- `data/starFacts.json`: 15–30 short calming facts (“This star is very relaxing.” “A gentle breeze seems to hum here.”).
- No external API calls.

## Files

- `src/components/dark/GardenScene.tsx` (orchestrator)
- `src/components/dark/Sky.tsx` (stars + scope + fact card)
- `src/components/dark/Windchimes.tsx`
- `src/components/dark/Fireflies.tsx`
- `src/components/dark/House.tsx` (outside + interior stub)
- `src/components/dark/Hud.tsx`
- `src/data/stars.json`, `src/data/starFacts.json`
- `src/styles/dark-garden.css`
- `src/assets/audio/ambient-night.(mp3|ogg)`, `chime.(mp3|ogg)` (optional placeholders)

## Implementation Steps

1) Scene skeleton: `GardenScene` renders hills + Sky + HUD; ambient loop (muted by default if needed).
2) Sky module: draw star field (use existing star coords or custom), scope movement, local fact card.
3) Windchimes: static chimes + timed breeze strikes; play soft tones via <audio>.
4) Fireflies + jar + net interactions.
5) House outside + interior stub (toggle state), “Return outside” link.
6) Polish: item icons in HUD, fade/float toasts on interactions.

## Non-Goals

- No network requests; all facts are local.
- No scoring or win/lose logic; purely zen.