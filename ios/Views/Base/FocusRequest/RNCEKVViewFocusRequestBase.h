//
//  RNCEKVViewFocusRequestBase.h
//  Pods
//
//  Created by Artur Kalach on 09/04/2026.
//

#ifndef RNCEKVViewFocusRequestBase_h
#define RNCEKVViewFocusRequestBase_h


#import "RNCEKVViewContextMenuBase.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNCEKVNativeProps.h"
#endif

@interface RNCEKVViewFocusRequestBase : RNCEKVViewContextMenuBase

@property BOOL autoFocus;


#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateFocusRequestProps:(const RNCEKV::AutoFocusProps &)oldProps
newProps:(const RNCEKV::AutoFocusProps &)newProps;

#endif

- (void)focus;
- (void)screenReaderFocus;

@end

#endif /* RNCEKVViewFocusRequestBase_h */
