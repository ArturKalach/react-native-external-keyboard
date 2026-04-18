//
//  RNCEKVViewContextMenuBase.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 09/04/2026.
//

#import <Foundation/Foundation.h>



#import "RNCEKVViewContextMenuBase.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNCEKVNativeProps.h"
#import "RNCEKVFabricEventHelper.h"
#endif

@implementation RNCEKVViewContextMenuBase {
  UIContextMenuInteraction *_contextMenuInteraction;
}

- (void)cleanReferences {
  [super cleanReferences];
  _enableContextMenu = false;
  [self updateContextMenuRegistration];
}

- (void)setEnableContextMenu:(BOOL)enableContextMenu {
  _enableContextMenu = enableContextMenu;
  [self updateContextMenuRegistration];
}

- (void)updateContextMenuRegistration {
  if (@available(iOS 13.0, *)) {
    BOOL shouldRegister = _enableContextMenu &&
    self.isKeyboardFocused;
    
    if (shouldRegister && _contextMenuInteraction == nil) {
      _contextMenuInteraction =
      [[UIContextMenuInteraction alloc] initWithDelegate:self];
      [self addInteraction:_contextMenuInteraction];
    }
    
    if (!shouldRegister && _contextMenuInteraction != nil) {
      [self removeInteraction:_contextMenuInteraction];
      _contextMenuInteraction = nil;
    }
  }
}

- (void)onFocusChangeHandler:(BOOL)isFocused {
  [super onFocusChangeHandler: isFocused];
  [self updateContextMenuRegistration];
}

- (UIContextMenuConfiguration *)contextMenuInteraction:
(UIContextMenuInteraction *)interaction
                        configurationForMenuAtLocation:(CGPoint)location
API_AVAILABLE(ios(13.0)) {
  if (self.isKeyboardFocused) {
    [self onContextMenuPressHandler];
    [self onBubbledContextMenuPressHandler];
  }

  return nil;
}

- (void)onContextMenuPressHandler {}
- (void)onBubbledContextMenuPressHandler {}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateContextMenuProps:(const RNCEKV::ContextMenuProps &)oldProps
newProps:(const RNCEKV::ContextMenuProps &)newProps {
  if (oldProps.enableContextMenu != newProps.enableContextMenu) {
    [self setEnableContextMenu: newProps.enableContextMenu];
    [self updateContextMenuRegistration];
  }
}

#endif


@end
