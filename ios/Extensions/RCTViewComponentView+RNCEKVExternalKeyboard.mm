//
//  UIView+RNCEKVExternalKeyboard.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 12/08/2025.
//

#import <Foundation/Foundation.h>

#import "RCTViewComponentView+RNCEKVExternalKeyboard.h"

#import <objc/runtime.h>
static const void *RNCEKVCustomGroupKey = &RNCEKVCustomGroupKey;

@implementation RCTViewComponentView (RNCEKVExternalKeyboard)

- (NSString *)rncekvCustomGroup {
    return objc_getAssociatedObject(self, RNCEKVCustomGroupKey);
}

- (void)setRncekvCustomGroup:(NSString *)rncekvCustomGroup {
    objc_setAssociatedObject(self, RNCEKVCustomGroupKey, rncekvCustomGroup, OBJC_ASSOCIATION_COPY_NONATOMIC);
}

- (NSString *)focusGroupIdentifier {
  NSString* rncekv = [self rncekvCustomGroup];
  if(rncekv) {
    return rncekv;
  }
  return [super focusGroupIdentifier];
}

@end
