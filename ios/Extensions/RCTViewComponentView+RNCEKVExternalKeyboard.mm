//
//  UIView+RNCEKVExternalKeyboard.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 12/08/2025.
//

#ifdef RCT_NEW_ARCH_ENABLED

#import <Foundation/Foundation.h>

#import "RCTViewComponentView+RNCEKVExternalKeyboard.h"

#import <objc/runtime.h>
static const void *RNCEKVCustomGroupKey = &RNCEKVCustomGroupKey;
static const void *RNCEKVCustomFocusEffect = &RNCEKVCustomFocusEffect;

@implementation RCTViewComponentView (RNCEKVExternalKeyboard)

- (NSString *)rncekvCustomGroup {
    return objc_getAssociatedObject(self, RNCEKVCustomGroupKey);
}

- (void)setRncekvCustomGroup:(NSString *)rncekvCustomGroup {
    objc_setAssociatedObject(self, RNCEKVCustomGroupKey, rncekvCustomGroup, OBJC_ASSOCIATION_COPY_NONATOMIC);
}

- (NSString *)rncekvCustomFocusEffect {
    return objc_getAssociatedObject(self, RNCEKVCustomFocusEffect);
}

- (void)setRncekvCustomFocusEffect:(NSString *)rncekvCustomFocusEffect {
    objc_setAssociatedObject(self, RNCEKVCustomFocusEffect, rncekvCustomFocusEffect, OBJC_ASSOCIATION_COPY_NONATOMIC);
}

- (NSString *)focusGroupIdentifier {
  NSString* rncekv = [self rncekvCustomGroup];
  if(rncekv) {
    return rncekv;
  }
  return [super focusGroupIdentifier];
}


- (UIFocusEffect*)focusEffect {
  UIFocusEffect* rncekv = [self rncekvCustomFocusEffect];
  if(rncekv) {
    return rncekv;
  }
  
  return [super focusEffect];
}

@end

#endif
