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
    }
    return self;
}

// ToDo RNCEKV-2, Double check condition, count more then 1 means that a view can be a ViewGroup, bun when we use hover component it can be considered as ViewGroup instead of touchable component, it can be improved by flag, or by removing hover component from js implementation
- (UIView*)getFocusingView {
    if(_delegate.isGroup) {
        return _delegate;
    }
    
    if(_delegate.subviews.count > 0 && _delegate.subviews[0].canBecomeFocused) {
        return _delegate.subviews[0];
    }
    
    return _delegate;
}

- (BOOL)canBecomeFocused {
    if(!_delegate.canBeFocused) {
        return false;
    }
    return [self getFocusingView] == _delegate;
}

-(BOOL)isHaloHidden {
    NSNumber* isHaloActive = [_delegate isHaloActive];
    return [isHaloActive isEqual: @NO];
}

-(void)displayHalo {
    if(@available(iOS 15.0, *)) {
        UIView* focusingView = [self getFocusingView];
        UIFocusEffect *focusEffect = nil;
        if([self isHaloHidden]) {
            [RNCEKVFocusEffectUtility emptyFocusEffect];
        } else if(_delegate.haloExpendX || _delegate.haloExpendY || _delegate.haloCornerRadius) {
            [RNCEKVFocusEffectUtility getFocusEffect: focusingView withExpandedX:_delegate.haloExpendX  withExpandedY:_delegate.haloExpendY withCornerRadius:_delegate.haloCornerRadius];
        }
        
        focusingView.focusEffect = focusEffect;
    }
}

-(void)updateHalo {
    if([self isHaloHidden]) return;
    if(@available(iOS 15.0, *)) {
        BOOL shouldUpdate = _delegate.haloExpendX || _delegate.haloExpendY || _delegate.haloCornerRadius;
        if(!shouldUpdate) return;
        
        UIView* focusingView = [self getFocusingView];
        UIFocusEffect *focusEffect = [RNCEKVFocusEffectUtility getFocusEffect: focusingView withExpandedX:_delegate.haloExpendX  withExpandedY:_delegate.haloExpendY withCornerRadius:_delegate.haloCornerRadius];
        
        focusingView.focusEffect = focusEffect;
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
