//
//  RNCEKVKeyboardFocusDelegate.m
//  Pods
//
//  Created by Artur Kalach on 26/08/2024.
//

#import <Foundation/Foundation.h>

#import "RNCEKVKeyboardFocusDelegate.h"
#import "RNCEKVFocusEffectUtility.h"

@implementation RNCEKVKeyboardFocusDelegate{
    UIView<RNCEKVKeyboardFocusProtocol>* _delegate;
}

- (instancetype _Nonnull )initWithView:(UIView<RNCEKVKeyboardFocusProtocol> *_Nonnull)delegate{
    self = [super init];
    if (self) {
        _delegate = delegate;
//        _delegate = delegate;
    }
    return self;
}

- (UIView*)getFocusingView {
    if(_delegate.subviews.count == 1 && _delegate.subviews[0].canBecomeFocused) {
        return _delegate.subviews[0];
    }
    
    return _delegate;
}

- (BOOL)canBecomeFocused {
    return [self getFocusingView] == _delegate;
}

-(BOOL)isHaloHidden {
    NSNumber* isHaloActive = [_delegate isHaloActive];
    return [isHaloActive isEqual: @NO];
}

-(void)updateHalo {
    if(@available(iOS 15.0, *)) {
        _delegate.focusEffect = [self isHaloHidden] ? [RNCEKVFocusEffectUtility emptyFocusEffect] : nil;
    }
}

- (void)willMoveToSuperview:(UIView *)newSuperview {
    if (newSuperview) {
        if (@available(iOS 14.0, *)) {
            if(_delegate.focusGroupIdentifier == nil) {
                _delegate.focusGroupIdentifier = [_delegate getFocusGroupIdentifier];
            }
        }
    }
}

- (void)addSubview:(UIView *)view {
    if (@available(iOS 15.0, *)) {
        if([self isHaloHidden] && [view canBecomeFocused]) {
            view.focusEffect = [RNCEKVFocusEffectUtility emptyFocusEffect];
        }
    }
}

//- (void)finalizeUpdates {
//    UIView* view = [self getFocusingView];
//    if (@available(iOS 15.0, *)) {
//        if([self isHaloHidden] && [view canBecomeFocused]) {
//            view.focusEffect = [RNCEKVFocusEffectUtility emptyFocusEffect];
//        }
//    }
//}



- (NSNumber*)isFocusChanged:(UIFocusUpdateContext *)context {
    UIView* view = [self getFocusingView];
    if(context.nextFocusedView == view) {
        return @YES;
    } else if (context.previouslyFocusedView == view) {
       return @NO;
    }
    
    return nil;
}

@end
