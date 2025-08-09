//
//  RCTEnhancedScrollView+RNCEKVExternalKeyboard.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 09/08/2025.
//


#ifdef RCT_NEW_ARCH_ENABLED

#import "RCTEnhancedScrollView.h"

@implementation RCTEnhancedScrollView (RNCEKVExternalKeyboard)

- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
  if(self.subviews.count) {
    return @[self.subviews[0]];
  }
  return [super preferredFocusEnvironments];
}

@end

#endif
