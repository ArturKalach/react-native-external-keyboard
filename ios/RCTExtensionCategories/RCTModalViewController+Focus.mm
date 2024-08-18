//
//  RCTFabricModalHostViewController+Focus.m
//  Pods
//
//  Created by Artur Kalach on 17/08/2024.
//

#import <Foundation/Foundation.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCTModalViewController+Focus.h"
#import "RNCEKVAutoFocus.h"

@implementation RCTFabricModalHostViewController (Focus)

- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
    UIView *focusView = [[RNCEKVAutoFocus sharedInstance] focusView];
    if (focusView) {
        return @[focusView];
    }

    return [super preferredFocusEnvironments];
}


@end

#else

#import "RCTModalViewController+Focus.h"
#import "RNCEKVAutoFocus.h"

@implementation RCTModalHostViewController (Focus)

- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
    UIView *focusView = [[RNCEKVAutoFocus sharedInstance] focusView];
    if (focusView) {
        return @[focusView];
    }

    return [super preferredFocusEnvironments];
}


@end


#endif
