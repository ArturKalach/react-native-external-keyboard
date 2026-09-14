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

#import "RNCEKVNativeProps.h"

@interface RNCEKVViewFocusChangeBase : RNCEKVViewGroupIdentifierBase<RNCEKVFocusProtocol>

@property BOOL canBeFocused;
@property BOOL hasOnFocusChanged;
@property (nonatomic, assign, readonly) BOOL isKeyboardFocused;


@property (nonatomic, strong, readonly) RNCEKVFocusDelegate* focusDelegate;

- (void)updateFocusProps:(const RNCEKV::FocusProps &)oldProps
newProps:(const RNCEKV::FocusProps &)newProps;

- (void)onFocusChangeHandler:(BOOL)isFocused;

- (NSNumber *)resolveFocusChange:(UIFocusUpdateContext *)context;

@end


#endif /* RNCEKVViewFocusChangeBase_h */
