//
//  RNCEKVViewFocusRequestBase.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 09/04/2026.
//

#import <Foundation/Foundation.h>
#import "UIViewController+RNCEKVExternalKeyboard.h"

#import "UIView+React.h"
#import "RNCEKVViewFocusRequestBase.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNCEKVNativeProps.h"
#import "RNCEKVFabricEventHelper.h"
#endif

@implementation RNCEKVViewFocusRequestBase {
  BOOL _isAttachedToWindow;
  BOOL _autoFocusRequested;
}

- (void)cleanReferences {
  [super cleanReferences];
  _isAttachedToWindow = NO;
  _autoFocusRequested = NO;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _isAttachedToWindow = NO;
    _autoFocusRequested = NO;
  }

  return self;
}

- (void)focus {
  UIViewController *controller = self.reactViewController;
  if (controller != nil) {
    [controller rncekvFocusView: self];
  }
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
      dispatch_async(dispatch_get_main_queue(), ^{
        dispatch_async(dispatch_get_main_queue(), ^{
          [self focus];
        });
      });
    }
  }
}


- (void)didMoveToWindow {
  [super didMoveToWindow];

  if (self.window) {
    [self onAttached];
  }

  if (self.window && !_isAttachedToWindow) {
    if (self.autoFocus) {
      [self focus];
    }
    _isAttachedToWindow = YES;
  }
}


@end
