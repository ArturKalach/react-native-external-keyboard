//
//  RNCEKVViewFocusRequestBase.h
//  Pods
//
//  Created by Artur Kalach on 09/04/2026.
//

#ifndef RNCEKVViewFocusRequestBase_h
#define RNCEKVViewFocusRequestBase_h


#import "RNCEKVViewContextMenuBase.h"

#import "RNCEKVNativeProps.h"

@interface RNCEKVViewFocusRequestBase : RNCEKVViewContextMenuBase

@property BOOL autoFocus;


- (void)updateFocusRequestProps:(const RNCEKV::AutoFocusProps &)oldProps
newProps:(const RNCEKV::AutoFocusProps &)newProps;

- (void)focus;
- (void)screenReaderFocus;

@end

#endif /* RNCEKVViewFocusRequestBase_h */
