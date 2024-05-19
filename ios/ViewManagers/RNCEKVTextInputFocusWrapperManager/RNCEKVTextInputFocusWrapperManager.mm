#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RNCEKVTextInputFocusWrapperManager.h"
#import "RNCEKVTextInputFocusWrapper.h"
#import "RCTBridge.h"


@implementation RNCEKVTextInputFocusWrapperManager

RCT_EXPORT_MODULE(TextInputFocusWrapper)

- (UIView *)view
{
    return [[RNCEKVTextInputFocusWrapper alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(onFocusChange, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(canBeFocused, BOOL, RNCEKVTextInputFocusWrapper)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : YES;
    [view setCanBeFocused: value];
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

@end
