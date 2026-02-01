//
//  RNCEKVFocusGuideHelper.h
//  Pods
//
//  Created by Artur Kalach on 16/07/2025.
//

#ifndef RNCEKVFocusGuideHelper_h
#define RNCEKVFocusGuideHelper_h

#import <UIKit/UIKit.h>
typedef NS_ENUM(NSUInteger, RNCEKVFocusGuideDirection) {
    RNCEKVFocusGuideDirectionLeft,
    RNCEKVFocusGuideDirectionRight,
    RNCEKVFocusGuideDirectionUp,
    RNCEKVFocusGuideDirectionDown,
};

@interface RNCEKVFocusGuideHelper : NSObject

+ (UIFocusGuide *)createGuideWithView:(UIView *)containerView
                            focusView:(UIView *)focusView
                              enabled:(BOOL)enabled;

+ (UIFocusGuide *)setGuideForDirection:(RNCEKVFocusGuideDirection)direction
                              inView:(UIView *)containerView
                          focusView:(UIView *)focusView
                            enabled:(BOOL)enabled;

@end

#endif /* RNCEKVFocusGuideHelper_h */
