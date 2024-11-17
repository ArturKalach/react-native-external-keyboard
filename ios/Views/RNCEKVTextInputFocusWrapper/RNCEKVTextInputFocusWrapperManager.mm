#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RNCEKVTextInputFocusWrapperManager.h"
#import "RNCEKVTextInputFocusWrapper.h"
#import "RCTBridge.h"
#import "RNCEKVUtils.h"

@implementation RNCEKVTextInputFocusWrapperManager

RCT_EXPORT_MODULE(TextInputFocusWrapper)

- (UIView *)view
{
    return [[RNCEKVTextInputFocusWrapper alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(onFocusChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMultiplyTextSubmit, RCTDirectEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(canBeFocused, BOOL, RNCEKVTextInputFocusWrapper)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : YES;
    [view setCanBeFocused: value];
}

RCT_CUSTOM_VIEW_PROPERTY(blurOnSubmit, BOOL, RNCEKVTextInputFocusWrapper)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : YES;
    [view setBlurOnSubmit: value];
}

RCT_CUSTOM_VIEW_PROPERTY(multiline, BOOL, RNCEKVTextInputFocusWrapper)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : NO;
    [view setMultiline: value];
}


RCT_CUSTOM_VIEW_PROPERTY(focusType, int, RNCEKVTextInputFocusWrapper)
{
    int value =  json ? [RCTConvert int:json] : 0;
    [view setFocusType: value];
}

RCT_CUSTOM_VIEW_PROPERTY(blurType, int, RNCEKVTextInputFocusWrapper)
{
    int value =  json ? [RCTConvert int:json] : 0;
    [view setBlurType: value];
}

RCT_CUSTOM_VIEW_PROPERTY(haloEffect, BOOL, RNCEKVTextInputFocusWrapper)
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

RCT_CUSTOM_VIEW_PROPERTY(tintColor, NSString, RNCEKVTextInputFocusWrapper)
{
    if (json) {
        NSString *tintColor = [RCTConvert NSString:json];
        UIColor* resultColor = tintColor ? colorFromHexString(tintColor) : nil;
        [view setTintColor: resultColor];
    }
}


@end
