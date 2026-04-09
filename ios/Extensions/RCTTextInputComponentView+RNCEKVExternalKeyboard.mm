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
#import "RNCEKVCustomFocusEffectProtocol.h"
#import "RCTUITextField.h"
#import "RCTUITextView.h"

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

@implementation RCTUITextField (RNCEKVExternalKeyboard)
  - (UIFocusEffect*)focusEffect {
    id superParent = self.superview.superview;
    if (superParent != nil && [superParent conformsToProtocol:@protocol(RNCEKVCustomFocusEffectProtocol)]) {
      id<RNCEKVCustomFocusEffectProtocol> parent = (id<RNCEKVCustomFocusEffectProtocol>)superParent;
      return [parent customFocusEffect];
    }
    
    return [super focusEffect];
  }
@end

#endif

