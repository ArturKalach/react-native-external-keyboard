//
//  A11yKeyboardModule.m
//  ExternalKeyboard
//
//  Created by Artur Kalach on 16.07.2023.
//  Copyright © 2023 Facebook. All rights reserved.
//



#import <React/RCTLog.h>
#import <UIKit/UIKit.h>

#import <React/RCTUIManager.h>
#import "A11yKeyboardModule.h"
#import "ExternalKeyboardView.h"
#import <React/RCTUIManager.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNExternalKeyboardViewSpec/RNExternalKeyboardViewSpec.h"
using namespace facebook::react;

#endif

@implementation A11yKeyboardModule

- (NSArray<NSString *> *)supportedEvents
{
    return @[];
}

- (instancetype)init
{
    return self;
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}


RCT_EXPORT_MODULE(A11yKeyboardModule);

RCT_EXPORT_METHOD(
                  setPreferredKeyboardFocus:(nonnull NSNumber *)itemId
                  nextElementId:(nonnull NSNumber *)nextElementId
                  ) {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView *field = [self.bridge.uiManager viewForReactTag:itemId];
        UIView *nextFocusElement = [self.bridge.uiManager viewForReactTag:nextElementId];
        if(field != nil && nextFocusElement != nil && [field isKindOfClass: [ExternalKeyboardView class]]) {
            ExternalKeyboardView *v = (ExternalKeyboardView *)field;
            v.myPreferredFocusedView = nextFocusElement;
            [v setNeedsFocusUpdate];
            [v updateFocusIfNeeded];
        }
    });
}

RCT_EXPORT_METHOD(
                  setKeyboardFocus:(nonnull NSNumber *)itemId
                  nextElementId:(nonnull NSNumber *)nextElementId
                  ) {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView *field = [self.bridge.uiManager viewForReactTag:itemId];
        UIView *nextFocusElement = [self.bridge.uiManager viewForReactTag:nextElementId];
        if(field != nil && nextFocusElement != nil && [field isKindOfClass: [ExternalKeyboardView class]]) {
            ExternalKeyboardView *v = (ExternalKeyboardView *)field;
            v.myPreferredFocusedView = nextFocusElement;
            [v setNeedsFocusUpdate];
            [v updateFocusIfNeeded];
            v.myPreferredFocusedView = v;
        }
    });
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeKeyboardModuleSpecJSI>(params);
}
#endif

@end
