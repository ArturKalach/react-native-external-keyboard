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


@end
