//
//  UIView+RNCEKVExternalKeyboard.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 12/08/2025.
//

#ifdef RCT_NEW_ARCH_ENABLED

#import <Foundation/Foundation.h>
#import "RNCEKVCustomFocusEffectProtocol.h"
#import "RCTViewComponentView+RNCEKVExternalKeyboard.h"
#import "RNCEKVCustomGroudIdProtocol.h"

//#import <objc/runtime.h>
//static const void *RNCEKVCustomGroupKey = &RNCEKVCustomGroupKey;
//static const void *RNCEKVCustomFocusEffect = &RNCEKVCustomFocusEffect;

@implementation RCTViewComponentView (RNCEKVExternalKeyboard)

//- (NSString *)rncekvCustomGroup {
//    return objc_getAssociatedObject(self, RNCEKVCustomGroupKey);
//}
//
//- (void)setRncekvCustomGroup:(NSString *)rncekvCustomGroup {
//    objc_setAssociatedObject(self, RNCEKVCustomGroupKey, rncekvCustomGroup, OBJC_ASSOCIATION_COPY_NONATOMIC);
//}

//- (NSString *)rncekvCustomFocusEffect {
//    return objc_getAssociatedObject(self, RNCEKVCustomFocusEffect);
//}

//- (void)setRncekvCustomFocusEffect:(NSString *)rncekvCustomFocusEffect {
//    objc_setAssociatedObject(self, RNCEKVCustomFocusEffect, rncekvCustomFocusEffect, OBJC_ASSOCIATION_COPY_NONATOMIC);
//}

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

@end

#endif
