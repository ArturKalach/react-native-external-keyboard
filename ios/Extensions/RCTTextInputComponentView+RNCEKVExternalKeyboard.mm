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

- (UIView<RCTBackedTextInputViewProtocol> *)backedTextInputView {
    Ivar ivar = class_getInstanceVariable([self class], "_backedTextInputView");
    return object_getIvar(self, ivar);
}

@end

#endif

