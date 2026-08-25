//
//  RNCEKVViewFocusChangeBase.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 09/04/2026.
//

#import <Foundation/Foundation.h>


#import "RNCEKVViewFocusChangeBase.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNCEKVNativeProps.h"
#import "RNCEKVFabricEventHelper.h"
#endif
//#import "RNCEKVFocusDelegate.h"

@implementation RNCEKVViewFocusChangeBase {
  NSNumber* _isFocused;
}

- (BOOL)isKeyboardFocused {
  return [_isFocused isEqual:@YES];
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _focusDelegate = [[RNCEKVFocusDelegate alloc] initWithView:self];
    _isFocused = nil;
  }

  return self;
}

- (void)cleanReferences {
  [super cleanReferences];
  [_focusDelegate reset];
  _isFocused = nil;
  _canBeFocused = false;
  _hasOnFocusChanged = false;
}

- (UIView *)getFocusTargetView {
  return [_focusDelegate getFocusingView];
}


- (BOOL)canBecomeFocused {
  if (!self.focusableWrapper) {
    return _canBeFocused;
  }

  return [super canBecomeFocused];
}


- (NSNumber *)resolveFocusChange:(UIFocusUpdateContext *)context {
  return [_focusDelegate isFocusChanged:context];
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
  NSNumber *focusChange = [self resolveFocusChange:context];

  if (focusChange != nil) {
    _isFocused = focusChange;
    [self onFocusChangeHandler:[focusChange isEqual:@YES]];
  }

  [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
}


#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateFocusProps:(const RNCEKV::FocusProps &)oldProps
                          newProps:(const RNCEKV::FocusProps &)newProps {
  if (_canBeFocused != newProps.canBeFocused) {
    [self setCanBeFocused:newProps.canBeFocused];
  }

  if (_hasOnFocusChanged != newProps.hasOnFocusChanged) {
    [self setHasOnFocusChanged:newProps.hasOnFocusChanged];
  }
}

#endif

- (void)onFocusChangeHandler:(BOOL)isFocused {}

@end
