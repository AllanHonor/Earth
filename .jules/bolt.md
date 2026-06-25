# Bolt's Performance Journal ⚡

## 2024-05-24 - Initial Performance Assessment
**Learning:** Found significant overhead in the main render loop.
- **String Allocation:** Creating 12k `rgba` strings/frame is a massive GC pressure.
- **Redundant State:** Gradients and stars are recalculated/re-initialized/re-drawn without caching.
- **Data Layout:** Array of objects for particles is slower than flat TypedArrays due to cache misses and property lookup overhead.

**Action:** Implement caching for gradients, optimize particle data structure, and minimize string allocations in the hot path.

## 2024-05-24 - Smoothness vs. Efficiency in HUD Rendering
**Learning:** Throttling UI updates (like telemetry or HUD tilts) to save CPU cycles can negatively impact "feel" if it interferes with 60fps input-coupled animations. Initially, HUD 3D transforms were tied to a 10% throttled logic block, causing "stepping" during mouse movement.
**Action:** Separate low-priority data updates (telemetry text) from high-priority visual feedback (3D transforms/input response). Keep input-coupled transforms in the main 60fps requestAnimationFrame loop.
