//
//  RNCEKVViewContextMenuBase.h
//  Pods
//
//  Created by Artur Kalach on 09/04/2026.
//

#ifndef RNCEKVViewContextMenuBase_h
#define RNCEKVViewContextMenuBase_h


#import "RNCEKVViewFocusChangeBase.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNCEKVNativeProps.h"
#endif

@interface RNCEKVViewContextMenuBase : RNCEKVViewFocusChangeBase<UIContextMenuInteractionDelegate>

@property (nonatomic, assign) BOOL enableContextMenu;

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateContextMenuProps:(const RNCEKV::ContextMenuProps &)oldProps
newProps:(const RNCEKV::ContextMenuProps &)newProps;
#endif

- (void)onContextMenuPressHandler;
- (void)onBubbledContextMenuPressHandler;

@end


#endif /* RNCEKVViewContextMenuBase_h */
