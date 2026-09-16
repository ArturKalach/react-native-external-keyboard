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

static const NSUInteger kRNCEKVMaxFocusContentDepth = 3;

static inline BOOL RNCEKVIsFocusWrapper(UIView *view) {
  return [view conformsToProtocol:@protocol(RNCEKVFocusProtocol)] &&
         [(id<RNCEKVFocusProtocol>)view focusableWrapper];
}

static inline BOOL RNCEKVIsFocusTarget(UIView *view) {
  if (RNCEKVIsFocusWrapper(view.superview)) {
    return YES;
  }
  return [view conformsToProtocol:@protocol(RNCEKVFocusProtocol)] &&
         ![(id<RNCEKVFocusProtocol>)view focusableWrapper];
}

@implementation RCTViewComponentView (RNCEKVExternalKeyboard)

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


- (UIFocusEffect*)focusEffect API_AVAILABLE(ios(15.0)) {
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


- (BOOL)isTransparentFocusItem {
  if ([super isTransparentFocusItem]) {
    return YES;
  }

  if (@available(iOS 26.0, *)) {
    UIView *target = self.superview;
    for (NSUInteger depth = 0;
         target != nil && depth < kRNCEKVMaxFocusContentDepth;
         depth++, target = target.superview) {
      if (RNCEKVIsFocusTarget(target)) {
        return YES;
      }
    }
  }

  return NO;
}

@end
