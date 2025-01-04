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

+ (UIFocusEffect *)getFocusEffect:(UIView *)effectView
                    withExpandedX:(CGFloat)expandedX
                    withExpandedY:(CGFloat)expandedY
                    withCornerRadius:(CGFloat)cornerRadius
{
    CGRect haloRect = effectView.bounds;
    if(expandedX || expandedY) {
        CGFloat dx = expandedX ? expandedX : 0;
        CGFloat dy = expandedY ? expandedY : 0;
        haloRect = CGRectInset(haloRect, -dx, -dy);
    }
    CALayerCornerCurve cornerCurve = kCACornerCurveContinuous;
    
    UIFocusEffect *focusEffect = [UIFocusHaloEffect effectWithRoundedRect:haloRect cornerRadius:cornerRadius curve:cornerCurve];
    
    return focusEffect;
}

@end
