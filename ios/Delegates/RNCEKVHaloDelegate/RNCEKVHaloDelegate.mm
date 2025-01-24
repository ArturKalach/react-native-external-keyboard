//
//  RNCEKVHaloDelegate.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 24/01/2025.
//

#import <Foundation/Foundation.h>


#import "RNCEKVHaloDelegate.h"
#import "RNCEKVFocusEffectUtility.h"

@implementation RNCEKVHaloDelegate {
    UIView<RNCEKVHaloProtocol>* _delegate;
}

- (instancetype _Nonnull )initWithView:(UIView<RNCEKVHaloProtocol> *_Nonnull)delegate{
    self = [super init];
    if (self) {
        _delegate = delegate;
    }
    return self;
}


-(BOOL)isHaloHidden {
    NSNumber* isHaloActive = [_delegate isHaloActive];
    return [isHaloActive isEqual: @NO];
}

-(void)displayHalo {
    if(@available(iOS 15.0, *)) {
        UIView* focusingView = [_delegate getFocusTargetView];
        UIFocusEffect *focusEffect = nil;
        if([self isHaloHidden]) {
            focusEffect = [RNCEKVFocusEffectUtility emptyFocusEffect];
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
        
        UIView* focusingView = [_delegate getFocusTargetView];
        UIFocusEffect *focusEffect = [RNCEKVFocusEffectUtility getFocusEffect: focusingView withExpandedX:_delegate.haloExpendX  withExpandedY:_delegate.haloExpendY withCornerRadius:_delegate.haloCornerRadius];
        
        focusingView.focusEffect = focusEffect;
    }
}

@end
