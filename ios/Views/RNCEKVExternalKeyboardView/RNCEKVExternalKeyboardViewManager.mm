#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RNCEKVExternalKeyboardViewManager.h"
#import "RNCEKVExternalKeyboardView.h"
#import "RCTBridge.h"
#import "RNCEKVUtils.h"

@implementation RNCEKVExternalKeyboardViewManager

RCT_EXPORT_MODULE(ExternalKeyboardView)

- (UIView *)view
{
    return [[RNCEKVExternalKeyboardView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(onFocusChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onContextMenuPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyUpPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyDownPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(myPreferredFocusedView, UIView)

RCT_CUSTOM_VIEW_PROPERTY(canBeFocused, BOOL, RNCEKVExternalKeyboardView)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : YES;
    [view setCanBeFocused: value];
}

RCT_CUSTOM_VIEW_PROPERTY(tintColor, NSString, RNCEKVExternalKeyboardView)
{
    if (json) {
        NSString *tintColor = [RCTConvert NSString:json];
        UIColor* resultColor = tintColor ? colorFromHexString(tintColor) : nil;
        [view setTintColor: resultColor];
    }
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

RCT_CUSTOM_VIEW_PROPERTY(autoFocus, BOOL, RNCEKVExternalKeyboardView)
{
    if (json) {
        BOOL value = [RCTConvert BOOL:json];
        [view setAutoFocus: value];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(haloEffect, BOOL, RNCEKVExternalKeyboardView)
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

RCT_CUSTOM_VIEW_PROPERTY(group, BOOL, RNCEKVExternalKeyboardView)
{
    BOOL value = json ? [RCTConvert BOOL:json] : NO;
    [view setIsGroup: value];
}


RCT_EXPORT_METHOD(focus:(nonnull NSNumber *)reactTag)
{
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        UIView *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[RNCEKVExternalKeyboardView class]]) {
            return;
        }
        RNCEKVExternalKeyboardView *keyboardView = (RNCEKVExternalKeyboardView*)view;
        [keyboardView focus];
    }];
}

@end
