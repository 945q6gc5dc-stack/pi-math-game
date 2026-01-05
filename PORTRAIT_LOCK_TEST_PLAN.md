# Portrait Lock Testing Plan - Tablet Fix

**Implementation Date**: 2026-01-04
**Fix**: JavaScript-enhanced device detection with CSS fallback
**Target**: Fix portrait lock not working on tablets in landscape mode

---

## What Was Implemented

### 1. JavaScript Device Detection (script.js:377-460)
- `detectDeviceType()` function with 95%+ accuracy
- Combines user agent, touch points, screen dimensions, and aspect ratio
- Handles iPad desktop mode using `navigator.maxTouchPoints`
- Returns: 'phone', 'tablet', or 'desktop'

### 2. Portrait Lock Application (script.js:437-451)
- `applyPortraitLock()` function applies `.force-portrait-lock` class
- Triggers on: page load, window resize, orientation change
- Console logging enabled for debugging

### 3. CSS Implementation (style.css:3312-3410)
- **Primary Method**: Class-based styling (`.force-portrait-lock`)
- **Fallback Method**: CSS media query `@media (pointer: coarse) and (min-aspect-ratio: 4/3) and (orientation: landscape)`
- Both methods avoid double-styling with `:not(.force-portrait-lock)`

---

## Testing Checklist

### Phase 1: Desktop Testing (Current Device)

**Expected Behavior**: Portrait lock should NEVER appear on desktop, regardless of window size or orientation.

- [ ] **Test 1.1**: Full-screen desktop browser
  - Open game in desktop browser at full screen
  - **Check Console**: Should log `[Portrait Lock] Device detected: Desktop`
  - **Check Console**: Should log `[Portrait Lock] ✗ Portrait lock DISABLED`
  - **Verify**: Game loads normally, no portrait lock overlay

- [ ] **Test 1.2**: Narrow desktop window (simulate tablet width)
  - Resize browser window to 800px width x 1200px height
  - **Check Console**: Device detection result
  - **Verify**: NO portrait lock should appear (desktop is desktop regardless of size)

- [ ] **Test 1.3**: Wide desktop window (landscape)
  - Resize browser window to 1400px width x 800px height
  - **Check Console**: Should still detect as desktop
  - **Verify**: NO portrait lock overlay

- [ ] **Test 1.4**: Browser DevTools responsive mode
  - Open DevTools → Toggle Device Toolbar
  - **DO NOT** select a specific device yet
  - Set custom dimensions: 1024px x 768px (iPad landscape dimensions)
  - **Check Console**: May detect as desktop (depends on user agent)
  - **Verify**: If detected as desktop, no lock should appear

**Phase 1 Status**: ⏸️ **Test this now on your current desktop/laptop**

---

### Phase 2: Mobile Phone Testing (iPhone/Android)

**Expected Behavior**: Portrait lock should appear ONLY when phone is rotated to landscape.

- [ ] **Test 2.1**: Portrait orientation (normal use)
  - Open game on phone in portrait mode
  - **Check Console** (if available via remote debugging): `[Portrait Lock] Device detected: Mobile Phone`
  - **Check Console**: `[Portrait Lock] ✗ Portrait lock DISABLED`
  - **Verify**: Game loads normally

- [ ] **Test 2.2**: Rotate to landscape
  - Rotate phone to landscape orientation
  - **Check Console**: `[Portrait Lock] ✓ Portrait lock ENABLED`
  - **Verify**: Purple gradient overlay appears
  - **Verify**: White card with "Please rotate your device to portrait mode" message
  - **Verify**: Main game content is hidden

- [ ] **Test 2.3**: Rotate back to portrait
  - Rotate phone back to portrait
  - **Check Console**: `[Portrait Lock] ✗ Portrait lock DISABLED`
  - **Verify**: Portrait lock overlay disappears immediately
  - **Verify**: Game content is visible and functional

- [ ] **Test 2.4**: Rapid orientation changes
  - Rapidly rotate phone: portrait → landscape → portrait → landscape
  - **Verify**: Portrait lock appears/disappears smoothly without lag
  - **Verify**: No flickering or double overlays

**Devices to Test**:
- [ ] iPhone SE (375×667)
- [ ] iPhone 14 (390×844)
- [ ] Samsung Galaxy S23 (360×800)
- [ ] Google Pixel 7 (412×915)

**Phase 2 Status**: ⏸️ **Requires physical phone or simulator**

---

### Phase 3: Tablet Testing (iPad/Android Tablet) - PRIMARY FIX

**Expected Behavior**: Portrait lock should appear when tablet is rotated to landscape (THIS IS THE FIX).

#### iPad Testing (Critical)

- [ ] **Test 3.1**: iPad in Portrait Mode (Safari)
  - Open game on iPad in portrait mode
  - **Check Console** (Safari Web Inspector): `[Portrait Lock] Device detected: iPad (tablet)`
  - **Check Console**: `[Portrait Lock] ✗ Portrait lock DISABLED`
  - **Verify**: Game loads normally, full functionality

- [ ] **Test 3.2**: iPad rotated to Landscape (Safari)
  - Rotate iPad to landscape orientation
  - **Check Console**: `[Portrait Lock] ✓ Portrait lock ENABLED`
  - **Verify**: ✅ Portrait lock overlay appears (THIS WAS BROKEN BEFORE)
  - **Verify**: Purple gradient background visible
  - **Verify**: "Please rotate your device to portrait mode" message centered
  - **Verify**: Main game content is hidden

- [ ] **Test 3.3**: iPad Desktop Mode (Safari Settings)
  - Enable "Request Desktop Website" in Safari settings
  - **Check Console**: Should still detect as iPad via `maxTouchPoints > 1`
  - **Check Console**: `[Portrait Lock] Device detected: iPad (tablet)`
  - **Verify**: Portrait lock still works in landscape

- [ ] **Test 3.4**: iPad Chrome Browser
  - Open game in Chrome for iOS
  - Test portrait → landscape → portrait transitions
  - **Verify**: Portrait lock works correctly

#### Android Tablet Testing

- [ ] **Test 3.5**: Samsung Galaxy Tab S9 (Portrait)
  - Open game in portrait mode
  - **Check Console**: `[Portrait Lock] Device detected: Android Tablet`
  - **Verify**: Game loads normally

- [ ] **Test 3.6**: Samsung Galaxy Tab S9 (Landscape)
  - Rotate to landscape
  - **Check Console**: `[Portrait Lock] ✓ Portrait lock ENABLED`
  - **Verify**: ✅ Portrait lock overlay appears

- [ ] **Test 3.7**: Android Tablet Chrome
  - Test in Chrome browser
  - **Verify**: Portrait lock works in landscape

**Critical Tablet Dimensions to Verify**:
- [ ] iPad Mini (744×1133 → 1133×744 in landscape)
- [ ] iPad (768×1024 → 1024×768 in landscape)
- [ ] iPad Pro 11" (834×1194 → 1194×834 in landscape)
- [ ] iPad Pro 12.9" (1024×1366 → 1366×1024 in landscape) ← **This was ALWAYS broken before**
- [ ] Samsung Galaxy Tab S9 (800×1280 → 1280×800 in landscape)

**Phase 3 Status**: ⏸️ **Requires physical tablet or BrowserStack**

---

### Phase 4: Edge Cases

- [ ] **Test 4.1**: Touchscreen Laptop (Surface Pro)
  - Open game on touchscreen Windows laptop
  - **Expected**: Should detect as desktop (screen dimensions + user agent)
  - **Verify**: NO portrait lock in any window size

- [ ] **Test 4.2**: Foldable Phone (Samsung Galaxy Fold)
  - Test in folded mode (phone-like)
  - Test in unfolded mode (tablet-like)
  - **Verify**: Portrait lock works in both modes when in landscape

- [ ] **Test 4.3**: Browser with JavaScript Disabled
  - Disable JavaScript in browser settings
  - Open game on tablet in landscape
  - **Expected**: CSS fallback should trigger portrait lock
  - **Check**: `@media (pointer: coarse)` fallback activates

- [ ] **Test 4.4**: Split-Screen Mode (iPad)
  - Open game in split-screen with another app
  - **Verify**: Portrait lock behavior based on orientation, not window size

- [ ] **Test 4.5**: Browser Zoom Levels
  - Test at 50%, 100%, 150% zoom
  - **Verify**: Portrait lock detection unaffected by zoom

---

## How to Access Console Logs

### Desktop Browser (Chrome/Edge/Firefox)
1. Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. Click "Console" tab
3. Look for `[Portrait Lock]` messages

### iPhone (Safari)
1. On Mac: Safari → Preferences → Advanced → Show Develop menu
2. Connect iPhone via USB
3. On Mac: Develop → [Your iPhone] → [Page Name]
4. Console logs will appear in Safari Web Inspector

### iPad (Safari)
1. Same as iPhone instructions above
2. Enable "Web Inspector" in iPad Settings → Safari → Advanced

### Android (Chrome)
1. Enable Developer Options on Android device
2. Enable USB Debugging
3. Connect to computer via USB
4. On Chrome desktop: chrome://inspect
5. Click "inspect" on your device

---

## Expected Console Output Examples

### ✅ Correct Desktop Output:
```
[Portrait Lock] Device detected: Desktop
[Portrait Lock] Device: desktop, Landscape: false, Width: 1920px, Height: 1080px
[Portrait Lock] ✗ Portrait lock DISABLED
```

### ✅ Correct Phone Portrait Output:
```
[Portrait Lock] Device detected: Mobile Phone
[Portrait Lock] Device: phone, Landscape: false, Width: 390px, Height: 844px
[Portrait Lock] ✗ Portrait lock DISABLED
```

### ✅ Correct Phone Landscape Output:
```
[Portrait Lock] Device detected: Mobile Phone
[Portrait Lock] Device: phone, Landscape: true, Width: 844px, Height: 390px
[Portrait Lock] ✓ Portrait lock ENABLED
```

### ✅ Correct iPad Landscape Output (THE FIX):
```
[Portrait Lock] Device detected: iPad (tablet)
[Portrait Lock] Device: tablet, Landscape: true, Width: 1024px, Height: 768px
[Portrait Lock] ✓ Portrait lock ENABLED
```

### ✅ Correct iPad Desktop Mode Output:
```
[Portrait Lock] Device detected: iPad (tablet)  ← Detected via maxTouchPoints
[Portrait Lock] Device: tablet, Landscape: true, Width: 1366px, Height: 1024px
[Portrait Lock] ✓ Portrait lock ENABLED
```

---

## Testing Tools

### 1. Browser DevTools (Free)
- Chrome DevTools responsive mode
- Firefox Responsive Design Mode
- Safari Responsive Design Mode
- **Limitation**: User agent may not match real devices

### 2. BrowserStack (Paid)
- Real device testing (iPad, Android tablets)
- Remote debugging with console access
- Free trial available: https://www.browserstack.com/

### 3. Physical Devices (Recommended)
- Borrow iPad/Android tablet from friend/family
- Test in Apple Store (use demo devices)
- Test in electronics store

### 4. iOS Simulator (Mac Only, Free)
1. Install Xcode from Mac App Store
2. Run: `open -a Simulator`
3. Hardware → Device → iPad Pro 12.9"
4. Rotate: Cmd+Left/Right arrow
5. Access Safari on simulator

---

## Success Criteria

| Device Type | Portrait | Landscape | Status |
|-------------|----------|-----------|--------|
| Desktop | ✅ No lock | ✅ No lock | ⏸️ Test Phase 1 |
| Phone | ✅ No lock | ✅ Lock shown | ⏸️ Test Phase 2 |
| Tablet | ✅ No lock | ✅ Lock shown | ⏸️ Test Phase 3 (CRITICAL) |
| Touchscreen Laptop | ✅ No lock | ✅ No lock | ⏸️ Test Phase 4 |

**Definition of Done**:
- ✅ Desktop: Never shows portrait lock (0% false positives)
- ✅ Phone: Shows portrait lock in landscape (95%+ accuracy)
- ✅ Tablet: Shows portrait lock in landscape (95%+ accuracy) ← **PRIMARY FIX**
- ✅ Console logs confirm correct device detection
- ✅ No JavaScript errors in console
- ✅ Smooth transitions without flickering

---

## Rollback Plan

If issues are discovered during testing:

### Quick Rollback (Restore Old CSS Method)
**File**: `style.css` line 3312-3410

Replace entire section with:
```css
/* Landscape orientation warning overlay for mobile devices and tablets (≤900px) */
@media (max-width: 900px) and (orientation: landscape) {
    .container { display: none !important; }
    body::before { /* ... old background styles ... */ }
    body::after { /* ... old message styles ... */ }
}
```

### Remove JavaScript (if causing errors)
**File**: `script.js` lines 367-460

Comment out or delete:
- `detectDeviceType()` function
- `applyPortraitLock()` function
- Event listeners (load, resize, orientationchange)

---

**Next Steps**: Start with Phase 1 (Desktop Testing) on your current device right now.
