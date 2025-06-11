//
//  UIViewController+RNCEKVExternalKeyboard.m
//  CocoaAsyncSocket
//
//  Created by Artur Kalach on 06/10/2024.
//

#import <Foundation/Foundation.h>

#import "UIViewController+RNCEKVExternalKeyboard.h"
#import <objc/runtime.h>



void SwizzleInstanceMethod(Class swizzleClass, SEL originalSelector, SEL swizzledSelector) {
    Method originalMethod = class_getInstanceMethod(swizzleClass, originalSelector);
    Method swizzledMethod = class_getInstanceMethod(swizzleClass, swizzledSelector);
    BOOL didAddMethod = class_addMethod(swizzleClass,
                                        originalSelector,
                                        method_getImplementation(swizzledMethod),
                                        method_getTypeEncoding(swizzledMethod));
    
    if (didAddMethod) {
        class_replaceMethod(swizzleClass,
                            swizzledSelector,
                            method_getImplementation(originalMethod),
                            method_getTypeEncoding(originalMethod));
    } else {
        method_exchangeImplementations(originalMethod, swizzledMethod);
    }
}

static char kCustomFocusViewKey;

@implementation UIViewController (RNCEKVExternalKeyboard)

- (UIView *)customFocusView {
    return objc_getAssociatedObject(self, &kCustomFocusViewKey);
}

- (void)setCustomFocusView:(UIView *)customFocusView {
    objc_setAssociatedObject(self, &kCustomFocusViewKey, customFocusView, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

+ (void)load
{
    static dispatch_once_t once_token;
    
    dispatch_once(&once_token, ^{
        SwizzleInstanceMethod([self class], @selector(viewDidAppear:), @selector(keyboardedViewDidAppear:));
        
        method_exchangeImplementations(
                                       class_getInstanceMethod(self, @selector(preferredFocusEnvironments)),
                                       class_getInstanceMethod(self, @selector(keyboardedPreferredFocusEnvironments))
                                       );
    });
}

- (void)keyboardedViewDidAppear:(BOOL)animated {
    [self keyboardedViewDidAppear:animated];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"ViewControllerChangedNotification" object:self];
}

- (NSArray<id<UIFocusEnvironment>> *)keyboardedPreferredFocusEnvironments {
    NSArray<id<UIFocusEnvironment>> *originalEnvironments = [self keyboardedPreferredFocusEnvironments];
    
    NSMutableArray *focusEnvironments = [originalEnvironments mutableCopy];
    
    UIView *customFocusView = self.customFocusView;
    if (customFocusView) {
        [focusEnvironments insertObject:customFocusView atIndex:0];
    }
    
    return focusEnvironments;
}

@end
