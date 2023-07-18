#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "ExternalKeyboardViewManager.h"
#import "ExternalKeyboardView.h"
#import "RCTBridge.h"
#import "Utils.h"


@implementation ExternalKeyboardViewManager

RCT_EXPORT_MODULE(ExternalKeyboardView)

- (UIView *)view
{
    return [[ExternalKeyboardView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(onFocusChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyUpPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyDownPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(myPreferredFocusedView, UIView)

RCT_CUSTOM_VIEW_PROPERTY(canBeFocused, BOOL, ExternalKeyboardView)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : YES;
    [view setCanBeFocused: value];
}

@end
