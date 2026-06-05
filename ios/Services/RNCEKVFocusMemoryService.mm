//
//  RNCEKVFocusMemoryService.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 05/06/2026.
//

#import <Foundation/Foundation.h>
#import "RNCEKVFocusMemoryService.h"
#import "RNCEKVKeyboardFocusService.h"

@implementation RNCEKVFocusMemoryService {
  __weak UIView *_storedView;
}

- (void)store:(id<UIFocusEnvironment>)environment {
  if (!environment) {
    return;
  }

  _storedView = [RNCEKVKeyboardFocusService getFocusedItem:environment];
  [RNCEKVKeyboardFocusService updatePreferredFocusEnvironment:_storedView];
}

- (void)restore {
  if (!_storedView) {
    return;
  }

  [RNCEKVKeyboardFocusService focus:_storedView];
  _storedView = nil;
}

- (UIView *)get {
  return _storedView;
}

- (void)clean {
  _storedView = nil;
}

@end
