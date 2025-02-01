//
//  RNCEKVFocusDelegate.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 24/01/2025.
//

#import <Foundation/Foundation.h>


#import "RNCEKVFocusDelegate.h"
#import "RNCEKVFocusProtocol.h"
#import "RNCEKVFocusEffectUtility.h"

@implementation RNCEKVFocusDelegate{
    UIView<RNCEKVFocusProtocol>* _delegate;
}

- (instancetype _Nonnull )initWithView:(UIView<RNCEKVFocusProtocol> *_Nonnull)delegate{
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
