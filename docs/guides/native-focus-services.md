# Advanced: native focus services

> [!NOTE]
> This is an **advanced, native-side** guide. Most apps never need it — for moving
> focus from JS use the [imperative ref](./programmatic-focus.md). Reach for these
> services only when you write your own native code (a custom view, a patch, a
> native module) and need to drive keyboard focus directly.

The library exposes the same two small building blocks on both platforms so you can
patch behavior or compose your own focus services on top of them:

| Role | iOS | Android |
| :-- | :-- | :-- |
| Stateless focus API | `RNCEKVKeyboardFocusService` | `KeyboardFocusService` |
| Remember / restore focus | `RNCEKVFocusMemoryService` | `FocusMemoryService` |

The memory service is built *on top of* the focus API — so anything it does, you
can also do by hand with the focus API alone.

---

## Focus API — `RNCEKVKeyboardFocusService` / `KeyboardFocusService`

Stateless. Read the focused view and move focus programmatically.

| iOS (static) | Android (static) | Does |
| :-- | :-- | :-- |
| `+ getFocusedItem:(id<UIFocusEnvironment>)` → `UIView *` | `getFocusedItem(View environment)` → `View` | Returns the view currently focused in that environment's window, or `nil`/`null`. |
| `+ updatePreferredFocusEnvironment:(UIView *)` | *(n/a)* | Marks a view preferred **without** forcing an update. iOS-only — Android focus is imperative. |
| `+ focus:(UIView *)` | `focus(View view)` | Moves keyboard focus to the view (on the main thread). |

> The target must be focusable (on Android: focusable, visible and enabled) — same
> rule as native focus everywhere.

---

## Memory service — `RNCEKVFocusMemoryService` / `FocusMemoryService`

Instance-based. Remembers a focused view (held weakly) so you can restore it after a
"leave then come back" flow — a modal, an overlay, a screen change.

| iOS | Android | Does |
| :-- | :-- | :-- |
| `- store:(id<UIFocusEnvironment>)` | `store(View environment)` | Captures the currently focused view in that environment. |
| `- restore` | `restore()` | Focuses the stored view (if any), then clears it. |
| `- get` → `UIView *` | `get()` → `View` | Returns the stored view without consuming it (peek). |
| `- clean` | `clean()` | Drops the stored reference without restoring focus. |

The only difference between flows is **call ordering**: a modal stores on present and
restores on dismiss; a navigation push stores on disappear and restores on appear.

---

## Simple example: an overlay focus service

A custom service that moves focus into an overlay when it opens, and gives focus back
to wherever it was when the overlay closes — built from the two services above.

### iOS

```objc
#import "RNCEKVKeyboardFocusService.h"
#import "RNCEKVFocusMemoryService.h"

@interface OverlayFocusService : NSObject
- (void)willShowOverlay:(UIView *)firstField;
- (void)didHideOverlay;
@end

@implementation OverlayFocusService {
  RNCEKVFocusMemoryService *_memory;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _memory = [RNCEKVFocusMemoryService new];
  }
  return self;
}

- (void)willShowOverlay:(UIView *)firstField {
  [_memory store:firstField];                      // remember what's focused now
  [RNCEKVKeyboardFocusService focus:firstField];   // move focus into the overlay
}

- (void)didHideOverlay {
  [_memory restore];                               // hand focus back
}

@end
```

### Android

```java
import com.externalkeyboard.services.KeyboardFocusService;
import com.externalkeyboard.services.FocusMemoryService;
import android.view.View;

public class OverlayFocusService {
  private final FocusMemoryService memory = new FocusMemoryService();

  public void willShowOverlay(View firstField) {
    memory.store(firstField);              // remember what's focused now
    KeyboardFocusService.focus(firstField); // move focus into the overlay
  }

  public void didHideOverlay() {
    memory.restore();                       // hand focus back
  }
}
```

Same shape on both platforms. Swap `restore` for `clean` if a flow is cancelled and
you want to drop the remembered view instead of focusing it.

---

## Patching / building your own from scratch

If you only need the focus API and want full control over state, skip the memory
service and keep the reference yourself:

```objc
// iOS — minimal hand-rolled remember/restore
__weak UIView *previous = [RNCEKVKeyboardFocusService getFocusedItem:container];
// … later …
[RNCEKVKeyboardFocusService focus:previous];
```

```java
// Android — minimal hand-rolled remember/restore
View previous = KeyboardFocusService.getFocusedItem(container);
// … later …
KeyboardFocusService.focus(previous);
```

---

## Related

- [Programmatic focus](./programmatic-focus.md) — the JS imperative ref (the common case)
- [API reference](../api/overview.md)

