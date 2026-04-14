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

RCT_EXPORT_VIEW_PROPERTY(onFocusChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMultiplyTextSubmit, RCTDirectEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(canBeFocused, BOOL, RNCEKVTextInputFocusWrapper)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : YES;
    [view setCanBeFocused: value];
}

RCT_CUSTOM_VIEW_PROPERTY(groupIdentifier, NSString, RNCEKVTextInputFocusWrapper)
{
    NSString* value = json ? [RCTConvert NSString:json] : nil;
    [view setCustomGroupId: value];
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
    if(view.isHaloHidden == value) {
      [view setIsHaloHidden: !value];
    }
  }
}

RCT_CUSTOM_VIEW_PROPERTY(tintColor, UIColor, RNCEKVTextInputFocusWrapper)
{
    if (json) {
        UIColor *tintColor = [RCTConvert UIColor:json];
        [view setTintColor: tintColor];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(orderGroup, NSString, RNCEKVTextInputFocusWrapper)
{
    NSString* value = json ? [RCTConvert NSString:json] : nil;
    [view setOrderGroup: value];
}

RCT_CUSTOM_VIEW_PROPERTY(orderIndex, NSNumber, RNCEKVTextInputFocusWrapper)
{
  if(json){
    NSNumber* value = [RCTConvert NSNumber:json];
    NSNumber* orderPosition = [value intValue] == -1 ? nil : value;
    [view setOrderPosition: orderPosition];
  }
}


RCT_CUSTOM_VIEW_PROPERTY(orderId, NSString, RNCEKVTextInputFocusWrapper)
{
    NSString* value = json ? [RCTConvert NSString:json] : nil;
    [view setOrderId: value];
}

RCT_CUSTOM_VIEW_PROPERTY(orderLeft, NSString, RNCEKVTextInputFocusWrapper)
{
    NSString* value = json ? [RCTConvert NSString:json] : nil;
    [view setOrderLeft: value];
}

RCT_CUSTOM_VIEW_PROPERTY(orderRight, NSString, RNCEKVTextInputFocusWrapper)
{
    NSString* value = json ? [RCTConvert NSString:json] : nil;
    [view setOrderRight: value];
}

RCT_CUSTOM_VIEW_PROPERTY(orderUp, NSString, RNCEKVTextInputFocusWrapper)
{
    NSString* value = json ? [RCTConvert NSString:json] : nil;
    [view setOrderUp: value];
}

RCT_CUSTOM_VIEW_PROPERTY(orderDown, NSString, RNCEKVTextInputFocusWrapper)
{
    NSString* value = json ? [RCTConvert NSString:json] : nil;
    [view setOrderDown: value];
}

RCT_CUSTOM_VIEW_PROPERTY(orderForward, NSString, RNCEKVTextInputFocusWrapper)
{
    view.orderForward = json ? [RCTConvert NSString:json] : nil;
}

RCT_CUSTOM_VIEW_PROPERTY(orderBackward, NSString, RNCEKVTextInputFocusWrapper)
{
    view.orderBackward = json ? [RCTConvert NSString:json] : nil;
}

RCT_CUSTOM_VIEW_PROPERTY(orderFirst, NSString, RNCEKVTextInputFocusWrapper)
{
    view.orderFirst = json ? [RCTConvert NSString:json] : nil;
}

RCT_CUSTOM_VIEW_PROPERTY(orderLast, NSString, RNCEKVTextInputFocusWrapper)
{
    view.orderLast = json ? [RCTConvert NSString:json] : nil;
}

RCT_CUSTOM_VIEW_PROPERTY(lockFocus, NSNumber, RNCEKVTextInputFocusWrapper)
{
    view.lockFocus = json ? [RCTConvert NSNumber:json] : nil;
}


@end
