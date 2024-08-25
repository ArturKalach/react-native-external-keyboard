//
//  RNCEKVExternalKeyboardRootViewManager.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 14/08/2024.
//

#import "RNCEKVExternalKeyboardRootView.h"
#import "RNCEKVExternalKeyboardRootViewManager.h"
#import "RNCEKVPreferredFocusEnvironment.h"
#import "RNCEKVExternalKeyboardView.h"
#import <React/RCTUIManager.h>

@implementation RNCEKVExternalKeyboardRootViewManager

RCT_EXPORT_MODULE(ExternalKeyboardRootView)

- (UIView *)view
{
    return [[RNCEKVExternalKeyboardRootView alloc] init];
}

RCT_CUSTOM_VIEW_PROPERTY(viewId, NSString, RNCEKVExternalKeyboardRootView)
{
      NSString* value =  json ? [RCTConvert NSString:json] : nil;
        if(value != nil) {
            NSString* oldViewId = [view viewId];
            if(oldViewId != nil && oldViewId != value){
                [[RNCEKVPreferredFocusEnvironment sharedInstance] detachRootView:oldViewId];
            }
            [[RNCEKVPreferredFocusEnvironment sharedInstance] storeRootView: value withView: view];
            [view setViewId: value];
        }
}

RCT_EXPORT_METHOD(focus:(nonnull NSNumber *)reactTag withRootViewId:(NSString *)rootViewId) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        UIView *view = viewRegistry[reactTag];
        
        if ([view isKindOfClass:[RNCEKVExternalKeyboardView class]]) {
            RNCEKVExternalKeyboardView *keyboardView = (RNCEKVExternalKeyboardView *)view;
            [keyboardView focus:rootViewId];
        }
    }];
}

@end
