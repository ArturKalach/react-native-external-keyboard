#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RNCEKVExternalKeyboardViewManager.h"
#import "RNCEKVExternalKeyboardView.h"
#import "RCTBridge.h"


@implementation RNCEKVExternalKeyboardViewManager

RCT_EXPORT_MODULE(ExternalKeyboardView)

- (UIView *)view
{
    return [[RNCEKVExternalKeyboardView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(onFocusChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyUpPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyDownPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onContextMenuPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(myPreferredFocusedView, UIView)

RCT_CUSTOM_VIEW_PROPERTY(canBeFocused, BOOL, RNCEKVExternalKeyboardView)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : YES;
    [view setCanBeFocused: value];
}

RCT_CUSTOM_VIEW_PROPERTY(hasOnFocusChanged, BOOL, RNCEKVExternalKeyboardView)
{
    BOOL value = json ? [RCTConvert BOOL:json] : NO;
    [view setHasOnFocusChanged: value];
}

RCT_CUSTOM_VIEW_PROPERTY(hasKeyDownPress, BOOL, RNCEKVExternalKeyboardView)
{
    BOOL value = json ? [RCTConvert BOOL:json] : NO;
    [view setHasOnPressDown: value];
}

RCT_CUSTOM_VIEW_PROPERTY(hasKeyUpPress, BOOL, RNCEKVExternalKeyboardView)
{
    BOOL value = json ? [RCTConvert BOOL:json] : NO;
    [view setHasOnPressUp: value];
}

RCT_CUSTOM_VIEW_PROPERTY(autoFocus, NSString, RNCEKVExternalKeyboardView)
{
  if (json) {
    NSString *rootViewId = [RCTConvert NSString:json];
    [view setAutoFocus: rootViewId];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(enableHaloEffect, BOOL, RNCEKVExternalKeyboardView)
{
    if(json) {
        BOOL value = [RCTConvert BOOL:json];
        if(view.isHaloActive == nil && !value) {
            [view setIsHaloActive: @0];
        }
        if(view.isHaloActive != nil) {
            [view setIsHaloActive: @(value)];
        }
    }
}

RCT_EXPORT_METHOD(focus:(nonnull NSNumber *)reactTag withRootView:(NSString *)withRootView)
{
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        UIView *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[RNCEKVExternalKeyboardView class]]) {
            return;
        }
        RNCEKVExternalKeyboardView *keyboardView = (RNCEKVExternalKeyboardView*)view;
        [keyboardView focus: withRootView];
    }];
}

@end
