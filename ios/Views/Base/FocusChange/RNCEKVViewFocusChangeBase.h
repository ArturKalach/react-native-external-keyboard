//
//  RNCEKVViewFocusChangeBase.h
//  Pods
//
//  Created by Artur Kalach on 09/04/2026.
//

#ifndef RNCEKVViewFocusChangeBase_h
#define RNCEKVViewFocusChangeBase_h

#import "RNCEKVViewGroupIdentifierBase.h"
#import "RNCEKVFocusDelegate.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNCEKVNativeProps.h"
#endif

@interface RNCEKVViewFocusChangeBase : RNCEKVViewGroupIdentifierBase<RNCEKVFocusProtocol>

@property BOOL canBeFocused;
@property BOOL hasOnFocusChanged;
@property (nonatomic, assign, readonly) BOOL isKeyboardFocused;


@property (nonatomic, strong, readonly) RNCEKVFocusDelegate* focusDelegate;

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateFocusProps:(const RNCEKV::FocusProps &)oldProps
newProps:(const RNCEKV::FocusProps &)newProps;
#endif

- (void)onFocusChangeHandler:(BOOL)isFocused;

- (NSNumber *)resolveFocusChange:(UIFocusUpdateContext *)context;

@end


#endif /* RNCEKVViewFocusChangeBase_h */
