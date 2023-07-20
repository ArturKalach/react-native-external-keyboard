#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RNCEKVExternalKeyboardViewManager.h"
#import "RNCEKVExternalKeyboardView.h"
#import "RCTBridge.h"
#import "Utils.h"


@implementation RNCEKVExternalKeyboardViewManager

RCT_EXPORT_MODULE(ExternalKeyboardView)

- (UIView *)view
{
    return [[RNCEKVExternalKeyboardView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(onFocusChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyUpPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyDownPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(myPreferredFocusedView, UIView)

RCT_CUSTOM_VIEW_PROPERTY(canBeFocused, BOOL, RNCEKVExternalKeyboardView)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : YES;
    [view setCanBeFocused: value];
}

@end
