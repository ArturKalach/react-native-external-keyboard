//
//  RNCEKVFocusGuideHelper.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 16/07/2025.
//

#import <Foundation/Foundation.h>
#import "RNCEKVFocusGuideHelper.h"
#import "RNCEKVFocusGuideHelper.h"

@implementation RNCEKVFocusGuideHelper

+ (UIFocusGuide *)createGuideWithView:(UIView *)containerView focusView:(UIView *)focusView enabled:(BOOL)enabled {
    if (!containerView || !focusView) {
        return nil;
    }

    UIFocusGuide *guide = [[UIFocusGuide alloc] init];
    [containerView addLayoutGuide:guide];
    guide.preferredFocusEnvironments = @[focusView];
    guide.enabled = enabled;

    return guide;
}

+ (UIFocusGuide *)setGuideForDirection:(RNCEKVFocusGuideDirection)direction
                              inView:(UIView *)containerView
                          focusView:(UIView *)focusView
                            enabled:(BOOL)enabled {
    UIFocusGuide *guide = [self createGuideWithView:containerView focusView:focusView enabled:enabled];
    if (!guide) {
        return nil;
    }

    NSArray<NSLayoutConstraint *> *constraints = nil;
    switch (direction) {
        case RNCEKVFocusGuideDirectionLeft:
            constraints = @[
                [guide.topAnchor constraintEqualToAnchor:containerView.topAnchor],
                [guide.bottomAnchor constraintEqualToAnchor:containerView.bottomAnchor],
                [guide.rightAnchor constraintEqualToAnchor:containerView.leftAnchor],
                [guide.widthAnchor constraintEqualToConstant:1]
            ];
            break;
        case RNCEKVFocusGuideDirectionRight:
            constraints = @[
                [guide.topAnchor constraintEqualToAnchor:containerView.topAnchor],
                [guide.bottomAnchor constraintEqualToAnchor:containerView.bottomAnchor],
                [guide.leftAnchor constraintEqualToAnchor:containerView.rightAnchor],
                [guide.widthAnchor constraintEqualToConstant:1]
            ];
            break;
        case RNCEKVFocusGuideDirectionUp:
            constraints = @[
                [guide.leftAnchor constraintEqualToAnchor:containerView.leftAnchor],
                [guide.rightAnchor constraintEqualToAnchor:containerView.rightAnchor],
                [guide.bottomAnchor constraintEqualToAnchor:containerView.topAnchor],
                [guide.heightAnchor constraintEqualToConstant:1]
            ];
            break;
        case RNCEKVFocusGuideDirectionDown:
            constraints = @[
                [guide.leftAnchor constraintEqualToAnchor:containerView.leftAnchor],
                [guide.rightAnchor constraintEqualToAnchor:containerView.rightAnchor],
                [guide.topAnchor constraintEqualToAnchor:containerView.bottomAnchor],
                [guide.heightAnchor constraintEqualToConstant:1]
            ];
            break;
        default:
            break;
    }

    if (constraints) {
        [NSLayoutConstraint activateConstraints:constraints];
    }

    return guide;
}

@end
