//
//  UIView+RNCEKVExternalKeyboard.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 12/08/2025.
//


#import <Foundation/Foundation.h>
#import "RNCEKVCustomFocusEffectProtocol.h"
#import "RCTViewComponentView+RNCEKVExternalKeyboard.h"
#import "RNCEKVCustomGroudIdProtocol.h"
#import "RNCEKVFocusProtocol.h"
#import "RNCEKVHaloProtocol.h"

@implementation RNCEKVViewClass (RNCEKVExternalKeyboard)

- (NSString *)focusGroupIdentifier {
  if ([self.superview conformsToProtocol:@protocol(RNCEKVCustomGroudIdProtocol)]) {
    id<RNCEKVCustomGroudIdProtocol> parent = (id<RNCEKVCustomGroudIdProtocol>)self.superview;
    NSString* groupId = [parent customGroupIdentifier];
    if(groupId != nil) {
      return groupId;
    }
  }

  return [super focusGroupIdentifier];
}


- (UIFocusEffect*)focusEffect {
  if ([self.superview conformsToProtocol:@protocol(RNCEKVCustomFocusEffectProtocol)]) {
    id<RNCEKVCustomFocusEffectProtocol> parent = (id<RNCEKVCustomFocusEffectProtocol>)self.superview;
    UIFocusEffect* effect = [parent customFocusEffect];
    if(effect != nil) {
      return effect;
    }
  }

  return [super focusEffect];
}

- (BOOL)canBecomeFocused {
  if ([self.superview conformsToProtocol:@protocol(RNCEKVFocusProtocol)]) {
    id<RNCEKVFocusProtocol> parent = (id<RNCEKVFocusProtocol>)self.superview;
    if (parent.focusableWrapper) {
      return parent.canBeFocused;
    }
  }

  return [super canBecomeFocused];
}

@end

