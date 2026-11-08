# Native focus services

Two native building blocks behind the library's keyboard focus handling, available to custom native code such as a custom view, a patch, or a native module. Both exist on iOS and Android with the same shape. Focus moves from JS go through the [`ref` focus methods](./programmatic-focus.md) instead.

| Role | iOS | Android |
| :-- | :-- | :-- |
| Stateless focus API | `RNCEKVKeyboardFocusService` | `KeyboardFocusService` |
| Focus memory | `RNCEKVFocusMemoryService` | `FocusMemoryService` |

## How it works

### Focus API

The focus API reads the focused view and moves keyboard focus. It is stateless, so all methods are static:

| iOS | Android | Result |
| :-- | :-- | :-- |
| `+ getFocusedItem:(id<UIFocusEnvironment>)` → `UIView *` | `getFocusedItem(View environment)` → `View` | View focused in the environment's window, or `nil` / `null` |
| `+ focus:(UIView *)` | `focus(View view)` | Keyboard focus on the view. On Android, the request is posted to the main thread. |
| `+ updatePreferredFocusEnvironment:(UIView *)` | — | Preferred focus view, without a focus update. Android has no equivalent, because its focus moves only on request. |

```java
View current = KeyboardFocusService.getFocusedItem(container);
KeyboardFocusService.focus(nextField);
```

The target follows the usual native rules. On Android it is focusable, visible, and enabled.

### Focus memory

The memory service builds on the focus API. It stores the focused view and restores focus to it later, for flows that leave and come back, such as a modal, an overlay, or a screen change. The stored view is held weakly, so a removed view is never kept alive:

| iOS | Android | Result |
| :-- | :-- | :-- |
| `- store:(id<UIFocusEnvironment>)` | `store(View environment)` | Stores the view focused in the environment's window |
| `- restore` | `restore()` | Focus on the stored view, then clears it |
| `- get` → `UIView *` | `get()` → `View` | Stored view, without clearing it |
| `- clean` | `clean()` | Clears the stored view without moving focus |

On iOS, `store` also marks the stored view as the preferred focus environment. Flows differ only in the call order. A modal stores on present and restores on dismiss, and a navigation push stores on disappear and restores on appear.

### Overlay focus service

The two services combine into a custom service. This one moves focus into an overlay when it opens and returns focus to the previous view when it closes:

```objc
// iOS
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
  [_memory store:firstField];                      // the view focused now
  [RNCEKVKeyboardFocusService focus:firstField];   // focus into the overlay
}

- (void)didHideOverlay {
  [_memory restore];                               // focus back
}

@end
```

```java
// Android
import android.view.View;
import com.externalkeyboard.services.FocusMemoryService;
import com.externalkeyboard.services.KeyboardFocusService;

public class OverlayFocusService {
  private final FocusMemoryService memory = new FocusMemoryService();

  public void willShowOverlay(View firstField) {
    memory.store(firstField);               // the view focused now
    KeyboardFocusService.focus(firstField); // focus into the overlay
  }

  public void didHideOverlay() {
    memory.restore();                       // focus back
  }
}
```

A cancelled flow calls `clean` instead of `restore`, so the stored view is dropped without receiving focus.

### Manual memory

Code that keeps its own state needs only the focus API. A reference to the focused view replaces the memory service:

```objc
// iOS
__weak UIView *previous = [RNCEKVKeyboardFocusService getFocusedItem:container];
// … later …
[RNCEKVKeyboardFocusService focus:previous];
```

```java
// Android
View previous = KeyboardFocusService.getFocusedItem(container);
// … later …
KeyboardFocusService.focus(previous);
```

---

## Quick decision guide

| Need | API |
| :-- | :-- |
| Focus from JS | `ref.current?.focus()` ([Programmatic focus](./programmatic-focus.md)) |
| Currently focused view in native code | `getFocusedItem` |
| Keyboard focus on a view from native code | `focus` |
| Focus return after a modal, overlay, or screen change | `FocusMemoryService` / `RNCEKVFocusMemoryService` |
| Own focus state in native code | `getFocusedItem` with a stored reference |

---

## Related

- [Programmatic focus](./programmatic-focus.md): `ref` focus methods from JS
- [API reference](../api/overview.md)

---

← [Focus groups](./keyboard-grouping.md) · [Component overview →](../components/overview.md)
