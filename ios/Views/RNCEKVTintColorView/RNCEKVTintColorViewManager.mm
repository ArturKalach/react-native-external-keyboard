//
//  RNCEKVTintColorViewManager.m
//  Pods
//
//  Created by Artur Kalach on 24/12/2024.
//

#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RNCEKVTintColorViewManager.h"
#import "RNCEKVTintColorView.h"
#import "RCTBridge.h"

@implementation RNCEKVTintColorViewManager

RCT_EXPORT_MODULE(TintColorView)

- (UIView *)view
{
    return [[RNCEKVTintColorView alloc] init];
}

RCT_CUSTOM_VIEW_PROPERTY(tintColor, UIColor, RNCEKVTintColorView)
{
    if (json) {
        UIColor *tintColor = [RCTConvert UIColor:json];
        [view setTintColor: tintColor];
    }
}


@end
