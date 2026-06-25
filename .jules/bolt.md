# Bolt's Performance Journal ⚡

## 2024-05-24 - Initial Performance Assessment
**Learning:** Found significant overhead in the main render loop.
- **String Allocation:** Creating 12k `rgba` strings/frame is a massive GC pressure.
- **Redundant State:** Gradients and stars are recalculated/re-initialized/re-drawn without caching.
- **Data Layout:** Array of objects for particles is slower than flat TypedArrays due to cache misses and property lookup overhead.

**Action:** Implement caching for gradients, optimize particle data structure, and minimize string allocations in the hot path.
