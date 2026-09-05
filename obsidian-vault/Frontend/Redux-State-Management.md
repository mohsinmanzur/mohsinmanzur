# Redux State Management

State management architecture using Redux Toolkit (`@reduxjs/toolkit` and `react-redux`).

## Implementation Details
- Store factory: `makeStore()` in `src/store/index.ts`
- Client Provider: `src/providers/StoreProvider.tsx` using `useRef` singleton
- Typed hooks: `useAppDispatch`, `useAppSelector` in `src/store/hooks.ts`
- Feature slices in `src/store/slices/` (e.g. `uiSlice`)

## Related Frontend Notes
- [[Frontend-Overview]]
- [[Reusable-UI-Components]]
