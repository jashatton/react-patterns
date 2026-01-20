# React Patterns Project - Progress Checkpoint

**Last Updated:** 2026-01-20
**Project Location:** `/Users/jason.hatton/projects/playground/react-patterns`
**Plan File:** `/Users/jason.hatton/.claude/plans/smooth-snacking-river.md`

## Project Overview

Educational React + TypeScript project demonstrating 10 common React state management patterns through interactive side-by-side comparisons (Wrong ❌ vs Right ✅).

**Tech Stack:**
- Vite 7.3.1 + React 19 + TypeScript
- Tailwind CSS v4.1.18 (configured with @tailwindcss/vite plugin)
- React Router for navigation
- react-syntax-highlighter for code display

**Dev Server:**
- Port: 5173 (fixed, configured in vite.config.ts)
- Command: `npm run dev`
- URL: http://localhost:5173/

## ✅ Completed (10/10 patterns) 🎉

### 1. useEffect Dependencies (/use-effect)
**Location:** `src/patterns/useEffect/`
- ✅ Missing Dependencies example - Shows stale data bug
- ✅ Unnecessary Dependencies example - setState in deps
- ✅ Interactive demos with user ID switching and search
- ✅ Code blocks with syntax highlighting
- ✅ Comprehensive explanations

### 2. Object/Array Mutation (/mutation)
**Location:** `src/patterns/mutation/`
- ✅ Array Mutation example - push() not triggering re-renders
- ✅ Object Mutation example - Direct property mutation
- ✅ Force Re-render buttons to prove data is mutated
- ✅ Fixed versions with spread operators
- ✅ Nested object update patterns

### 3. Derived State Anti-pattern (/derived-state)
**Location:** `src/patterns/derivedState/`
- ✅ Unnecessary State example - fullName sync issues
- ✅ Syncing Props to State example - useEffect anti-pattern
- ✅ Fixed versions with calculated values and key prop
- ✅ Shows timing issues in console

### 4. Keys in Lists (/keys)
**Location:** `src/patterns/keys/`
- ✅ Index as Key example - Sort/filter causing state to stick to wrong items
- ✅ Fixed version using stable IDs as keys
- ✅ Interactive demos with notes and favorites that stick to wrong people
- ✅ Sort, Reverse, and Shuffle buttons to demonstrate the bug
- ✅ "Try This Bug" and "Try This Fix" instruction boxes

### 5. useCallback Usage (/use-callback)
**Location:** `src/patterns/useCallback/`
- ✅ Missing useCallback example - React.memo child re-rendering unnecessarily
- ✅ Fixed version with useCallback for stable function reference
- ✅ Premature Optimization example - useCallback everywhere unnecessarily
- ✅ Fixed version with simple inline functions
- ✅ RenderCounter showing actual re-render behavior
- ✅ Expensive child component (10ms delay) to demonstrate performance impact
- ✅ "Try This Bug" and "Try This Fix" instruction boxes

### 6. useMemo Usage (/use-memo)
**Location:** `src/patterns/useMemo/`
- ✅ Expensive Calculation example - Prime number finder running on every render
- ✅ Fixed version with useMemo - Only recalculates when dependencies change
- ✅ Premature Memoization example - Memoizing trivial string operations
- ✅ Fixed version without useMemo - Simple calculations are faster
- ✅ Visible calculation time display (shows ~100-200ms for expensive operations)
- ✅ Interactive controls to trigger unrelated re-renders
- ✅ "Try This Bug" and "Try This Fix" instruction boxes

### 7. Arrow Functions in Components (/arrow-functions)
**Location:** `src/patterns/arrowFunctions/`
- ✅ Inline Arrow Functions example - Breaking React.memo optimization
- ✅ Fixed version with useCallback for stable references
- ✅ Stale Closures example - setTimeout capturing old state values
- ✅ Fixed version using refs and functional setState updates
- ✅ Interactive demonstrations showing render count behavior
- ✅ Async timeout examples to demonstrate stale closure bugs
- ✅ "Try This Bug" and "Try This Fix" instruction boxes

### 8. React Context Issues (/context)
**Location:** `src/patterns/context/`
- ✅ Single Context example - One context for all app state causing all consumers to re-render
- ✅ Split Contexts example - Separate contexts for user and theme data
- ✅ Non-Memoized Context Value example - New object on every render
- ✅ Memoized Context Value example - Using useMemo to prevent unnecessary re-renders
- ✅ Interactive demonstrations with render counters
- ✅ Code blocks with syntax highlighting
- ✅ Comprehensive explanations and best practices

### 9. useRef Misuse (/use-ref)
**Location:** `src/patterns/useRef/`
- ✅ useState Instead of useRef example - Unnecessary re-renders for timer IDs
- ✅ Fixed version with useRef for non-rendering data
- ✅ useRef Instead of useState example - UI not updating when ref changes
- ✅ Fixed version with useState for rendering data
- ✅ Interactive demonstrations showing render count differences
- ✅ Code blocks with syntax highlighting
- ✅ Clear explanations of when to use each hook

### 10. Lifting State Issues (/lifting-state)
**Location:** `src/patterns/liftingState/`
- ✅ State Too High example - App-level state causing all components to re-render
- ✅ Fixed version with local state - Only relevant components re-render
- ✅ State Not Lifted Enough example - Duplicate state in siblings causing sync bugs
- ✅ Fixed version with lifted state - Shared state in common parent
- ✅ Interactive demonstrations showing render count behavior
- ✅ Shopping cart example showing out-of-sync state
- ✅ Code blocks with syntax highlighting
- ✅ Comprehensive explanations of when to lift state and when not to
- ✅ "Try This Bug" and "Try This Fix" instruction boxes

## 🎉 Project Complete! (10/10 patterns)

## Core Components (All Complete)

### Layout Components (`src/components/layout/`)
- ✅ ComparisonLayout.tsx - Side-by-side wrong/right layout
- ✅ CodeBlock.tsx - Syntax highlighting with copy button
- ✅ PatternPage.tsx - Page wrapper with breadcrumbs
- ✅ ExplanationCard.tsx - Info/warning/success cards
- ✅ Navigation.tsx - Top nav with all pattern links

### Shared Components (`src/components/shared/`)
- ✅ Button.tsx - Reusable button with variants
- ✅ Counter.tsx - Counter display with increment/decrement
- ✅ Timer.tsx - Timer utility component
- ✅ RenderCounter.tsx - Shows component render count

### Pages
- ✅ Home.tsx - Landing page with all 10 pattern cards organized by category

## Technical Notes

### Tailwind CSS v4 Configuration
- Using v4.1.18 (NOT v4.0.0 which has Vite 7 compatibility issues)
- Plugin: @tailwindcss/vite@4.1.18
- No tailwind.config.js or postcss.config.js needed
- Custom classes in src/index.css: `.comparison-wrong`, `.comparison-right`

### Known Issues & Solutions
✅ **RESOLVED:** Tailwind v4.0.0 + Vite 7 compatibility
- **Solution:** Upgraded to Tailwind v4.1.18
- **Note:** If errors occur, clear node_modules and reinstall

### Port Configuration
- Dev server configured to use port 5173 (strict mode)
- See vite.config.ts: `server: { port: 5173, strictPort: true }`

## Pattern Implementation Checklist

For each pattern, create:
- [ ] Directory: `src/patterns/{patternName}/`
- [ ] Wrong example component
- [ ] Fixed example component
- [ ] Main page component using PatternPage layout
- [ ] ComparisonLayout with both examples
- [ ] Code blocks showing wrong/right code
- [ ] ExplanationCards with context
- [ ] Update App.tsx to add route
- [ ] Interactive demos where bugs are visible
- [ ] Console logging where helpful
- [ ] **"Try This Bug" / "Try This Fix" sections** (see Design Guidelines below)

## Design Guidelines for Comparison Examples

### Interactive Instruction Boxes (REQUIRED)
Every wrong/fixed comparison MUST include instructional boxes at the bottom:

**Wrong Example (Bug):**
- Use colored box: `bg-red-100 border-2 border-red-400`
- Header: **ALWAYS** use `🐛 Try This Bug:` (be consistent!)
- Numbered steps (`<ol>`) to reproduce the bug
- "Why?" section with `border-t` separator explaining root cause
- Include code snippets with `bg-red-200 px-1 rounded` inline highlights

**Fixed Example:**
- Use colored box: `bg-green-100 border-2 border-green-400`
- Header: **ALWAYS** use `✅ Try This Fix:` (be consistent!)
- Numbered steps (`<ol>`) to test the fix
- "Why it works:" section explaining the solution
- Include code snippets with `bg-green-200 px-1 rounded` inline highlights

**Example Structure:**
```tsx
<div className="p-4 bg-red-100 border-2 border-red-400 rounded">
  <div className="text-sm text-red-800 space-y-2">
    <div className="font-bold text-base">🐛 Try This Bug:</div>
    <ol className="list-decimal list-inside space-y-1">
      <li>Step 1 to reproduce bug</li>
      <li>Step 2 - notice what goes wrong 🤯</li>
      <li>Step 3 - observe the impact</li>
    </ol>
    <div className="mt-3 pt-3 border-t border-red-300">
      <strong>Why?</strong> Explanation with
      <code className="bg-red-200 px-1 rounded">code snippets</code>
    </div>
  </div>
</div>
```

### Key Principles
1. **Action-oriented**: Tell users exactly what to click/type
2. **Observable**: Make bugs visually obvious and dramatic
3. **Educational**: Explain WHY the bug happens and WHY the fix works
4. **Consistent**: Use same colors, structure, and emoji across all patterns
5. **Code references**: Highlight specific code patterns that are wrong/right

## Next Steps

1. **Implement Keys in Lists pattern** - Very visual, shows state sticking to wrong items
2. **Implement useCallback pattern** - Important for performance
3. **Implement useMemo pattern** - Pairs well with useCallback
4. **Continue with remaining patterns**

## Quick Start (Resuming Work)

```bash
cd /Users/jason.hatton/projects/playground/react-patterns
npm run dev
# Opens at http://localhost:5173/
```

## Commands

```bash
# Development
npm run dev          # Start dev server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build

# If issues occur
rm -rf node_modules package-lock.json
npm install
```

## Files Reference

- **Main Plan:** `/Users/jason.hatton/.claude/plans/smooth-snacking-river.md`
- **This Progress File:** `PROGRESS.md`
- **App Entry:** `src/App.tsx`
- **Routes:** See App.tsx Routes section
- **Styles:** `src/index.css`
- **Vite Config:** `vite.config.ts`
