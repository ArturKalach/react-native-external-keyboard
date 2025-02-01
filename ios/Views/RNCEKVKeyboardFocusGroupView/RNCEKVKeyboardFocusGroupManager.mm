//
//  RNCEKVKeyboardFocusGroupManager.m
//  Pods
//
//  Created by Artur Kalach on 24/12/2024.
//

#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RNCEKVKeyboardFocusGroupManager.h"
#import "RNCEKVKeyboardFocusGroup.h"
#import "RCTBridge.h"

@implementation RNCEKVKeyboardFocusGroupManager

RCT_EXPORT_VIEW_PROPERTY(onGroupFocusChange, RCTDirectEventBlock)

RCT_EXPORT_MODULE(KeyboardFocusGroup)

- (UIView *)view
{
    return [[RNCEKVKeyboardFocusGroup alloc] init];
}

RCT_CUSTOM_VIEW_PROPERTY(tintColor, UIColor, RNCEKVKeyboardFocusGroup)
{
    if (json) {
        UIColor *tintColor = [RCTConvert UIColor:json];
        [view setTintColor: tintColor];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(groupIdentifier, NSString, RNCEKVKeyboardFocusGroup)
{
   NSString* value = json ? [RCTConvert NSString:json] : nil;
   [view setCustomGroupId: value];
}



@end
