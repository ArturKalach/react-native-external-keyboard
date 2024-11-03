//
//  RNCEKVFocusEffectUtility.m
//  Pods
//
//  Created by Artur Kalach on 26/08/2024.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RNCEKVFocusEffectUtility.h"

@implementation RNCEKVFocusEffectUtility

+ (UIFocusEffect *)emptyFocusEffect {
    static UIFocusEffect *emptyFocusEffect = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        emptyFocusEffect = [UIFocusHaloEffect effectWithPath: [UIBezierPath bezierPath]];
    });
    return emptyFocusEffect;
}

@end
