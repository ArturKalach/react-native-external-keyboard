//
//  RCTTextInputComponentView+RNCEKVExternalKeyboard.mm
//  CocoaAsyncSocket
//
//  Created by Artur Kalach on 14/11/2024.
//
#ifdef RCT_NEW_ARCH_ENABLED
#import "RCTTextInputComponentView+RNCEKVExternalKeyboard.h"
#import <React/RCTBackedTextInputViewProtocol.h>
#import <objc/runtime.h>

@implementation RCTTextInputComponentView (RNCEKVExternalKeyboard)

- (UIView *)rncekbBackedTextInputView {
  Ivar ivar = class_getInstanceVariable([self class], "_backedTextInputView");
  if (!ivar) {
    return nil;
  }
  
  id value = object_getIvar(self, ivar);
  if ([value isKindOfClass:[UIView class]]) {
    return (UIView*)value;
  }
  return nil;
}

@end

#endif

