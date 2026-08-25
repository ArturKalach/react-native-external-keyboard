//
//  RNCEKVViewFocusRequestBase.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 09/04/2026.
//

#import <Foundation/Foundation.h>

#import "UIView+React.h"
#import "RNCEKVViewFocusRequestBase.h"
#import "RNCEKVKeyboardFocusService.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNCEKVNativeProps.h"
#import "RNCEKVFabricEventHelper.h"
#endif

@implementation RNCEKVViewFocusRequestBase {
  BOOL _autoFocusRequested;
  BOOL _pendingFocusRequest;
  NSUInteger _autoFocusGeneration;
}

- (void)cleanReferences {
  [super cleanReferences];
  _autoFocusRequested = NO;
  _pendingFocusRequest = NO;
  _autoFocusGeneration++;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _autoFocusRequested = NO;
  }

  return self;
}

- (void)focus {
  UIViewController *controller = self.reactViewController;
  if (controller == nil) {
    _pendingFocusRequest = YES;
    return;
  }
  [RNCEKVKeyboardFocusService focus:self withFallback:controller];
}

- (void)screenReaderFocus {
  dispatch_async(dispatch_get_main_queue(), ^{
    UIView *focusView = [self getFocusTargetView];
    UIAccessibilityPostNotification(UIAccessibilityLayoutChangedNotification,
                                    focusView);
  });
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateFocusRequestProps:(const RNCEKV::AutoFocusProps &)oldProps
newProps:(const RNCEKV::AutoFocusProps &)newProps {
    if (oldProps.autoFocus != newProps.autoFocus) {
      [self setAutoFocus: newProps.autoFocus];
    }
}


#endif


- (void)onAttached
{
  [self focusOnMount];
}

- (void)focusOnMount {
  if (self.autoFocus) {
    if(!_autoFocusRequested) {
      _autoFocusRequested = YES;
      NSUInteger generation = _autoFocusGeneration;
      __weak __typeof(self) weakSelf = self;
      dispatch_async(dispatch_get_main_queue(), ^{
        dispatch_async(dispatch_get_main_queue(), ^{
          __typeof(self) strongSelf = weakSelf;
          if (strongSelf == nil || strongSelf->_autoFocusGeneration != generation) {
            return;
          }
          if (strongSelf.window && strongSelf.autoFocus) {
            [strongSelf focus];
          }
        });
      });
    }
  }
}


- (void)didMoveToWindow {
  [super didMoveToWindow];

  if (self.window) {
    if (_pendingFocusRequest) {
      _pendingFocusRequest = NO;
      [self focus];
    }
    [self onAttached];
  }
}


@end
