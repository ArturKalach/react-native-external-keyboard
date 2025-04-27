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

RCT_EXPORT_VIEW_PROPERTY(onFocusChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onContextMenuPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onBubbledContextMenuPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyUpPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyDownPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(myPreferredFocusedView, UIView)

RCT_CUSTOM_VIEW_PROPERTY(canBeFocused, BOOL, RNCEKVExternalKeyboardView)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : YES;
    [view setCanBeFocused: value];
}

RCT_CUSTOM_VIEW_PROPERTY(tintColor, UIColor, RNCEKVExternalKeyboardView)
{
    if (json) {
        UIColor *tintColor = [RCTConvert UIColor:json];
        [view setTintColor: tintColor];
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

RCT_CUSTOM_VIEW_PROPERTY(enableA11yFocus, BOOL, RNCEKVExternalKeyboardView)
{
    if(json) {
        BOOL value = json ? [RCTConvert BOOL:json] : NO;
        [view setEnableA11yFocus: value];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(screenAutoA11yFocus, BOOL, RNCEKVExternalKeyboardView)
{
    //stub
}

RCT_CUSTOM_VIEW_PROPERTY(screenAutoA11yFocusDelay, int, RNCEKVExternalKeyboardView)
{
    //stub
}

RCT_CUSTOM_VIEW_PROPERTY(haloCornerRadius, float, RNCEKVExternalKeyboardView)
{
    if(json) {
        CGFloat value = [RCTConvert CGFloat:json];
        [view setHaloCornerRadius: value];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(haloExpendX, float, RNCEKVExternalKeyboardView)
{
    if(json) {
        CGFloat value = [RCTConvert CGFloat:json];
        [view setHaloExpendX: value];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(haloExpendY, float, RNCEKVExternalKeyboardView)
{
    if(json) {
        CGFloat value = [RCTConvert CGFloat:json];
        [view setHaloExpendY: value];
    }
}


RCT_CUSTOM_VIEW_PROPERTY(group, BOOL, RNCEKVExternalKeyboardView)
{
    BOOL value = json ? [RCTConvert BOOL:json] : NO;
    [view setIsGroup: value];
}

RCT_CUSTOM_VIEW_PROPERTY(groupIdentifier, NSString, RNCEKVExternalKeyboardView)
{
    NSString* value = json ? [RCTConvert NSString:json] : nil;
    [view setCustomGroupId: value];
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
