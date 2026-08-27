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
#import "UIViewController+RNCEKVExternalKeyboard.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNCEKVNativeProps.h"
#import "RNCEKVFabricEventHelper.h"
#endif

@implementation RNCEKVViewFocusRequestBase {
  BOOL _autoFocusRequested;
  BOOL _pendingFocusRequest;
  BOOL _pendingScreenReaderFocus;
  NSUInteger _autoFocusGeneration;
  __weak UIViewController *_focusRoutedController;
}

- (void)cleanReferences {
  [super cleanReferences];
  [self clearRoutedFocusTarget];
  _autoFocusRequested = NO;
  _pendingFocusRequest = NO;
  _pendingScreenReaderFocus = NO;
  _autoFocusGeneration++;
}

// Clears this view's preferred-focus entry without removing a newer request
// from another view.
- (void)clearRoutedFocusTarget {
  UIViewController *routedController = _focusRoutedController;
  if (routedController != nil && routedController.rncekvCustomFocusView == self) {
    routedController.rncekvCustomFocusView = nil;
  }
  _focusRoutedController = nil;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _autoFocusRequested = NO;
  }

  return self;
}

- (void)focus {
  UIViewController *controller = self.reactViewController;
  if (controller == nil || self.window == nil) {
    _pendingFocusRequest = YES;
    return;
  }
  _pendingFocusRequest = NO;
  _focusRoutedController = [RNCEKVKeyboardFocusService focus:self withFallback:controller];
}

- (void)screenReaderFocus {
  if (self.window == nil) {
    _pendingScreenReaderFocus = YES;
    return;
  }
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
          if (strongSelf.window == nil) {
            // The view detached before autofocus ran. Let the next attachment
            // try again.
            strongSelf->_autoFocusRequested = NO;
            return;
          }
          if (strongSelf.autoFocus) {
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
    if (_pendingScreenReaderFocus) {
      _pendingScreenReaderFocus = NO;
      [self screenReaderFocus];
    }
    [self onAttached];
  } else {
    // A detached view must no longer be the controller's preferred target.
    [self clearRoutedFocusTarget];
  }
}


@end
