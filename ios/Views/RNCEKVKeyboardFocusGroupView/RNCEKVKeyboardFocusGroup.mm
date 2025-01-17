//
//  TintColorView.m
//  Pods
//
//  Created by Artur Kalach on 24/12/2024.
//

#import "RNCEKVKeyboardFocusGroup.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>

#ifdef RCT_NEW_ARCH_ENABLED
#include <string>
#import "RNCEKVHeaders.h"

#import "RCTFabricComponentsPlugins.h"
#import "RNCEKVFabricEventHelper.h"
#import <React/RCTConversions.h>

using namespace facebook::react;

@interface RNCEKVKeyboardFocusGroup () <RCTKeyboardFocusGroupViewProtocol>

@end

#endif

@implementation RNCEKVKeyboardFocusGroup

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        _isGroupFocused = false;
#ifdef RCT_NEW_ARCH_ENABLED
        static const auto defaultProps = std::make_shared<const KeyboardFocusGroupProps>();
        _props = defaultProps;
#endif
    }
    
    return self;
}
- (NSString *)getFocusGroupIdentifierForView:(UIView *)view {
    id<UIFocusEnvironment> focusEnvironment = view;
    while (focusEnvironment) {
        if ([focusEnvironment respondsToSelector:@selector(focusGroupIdentifier)]) {
            NSString *focusGroupIdentifier = [focusEnvironment focusGroupIdentifier];
            if (focusGroupIdentifier) {
                return focusGroupIdentifier;
            }
        }
        focusEnvironment = focusEnvironment.parentFocusEnvironment;
    }
    return nil; // No focus group identifier found
}


- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
    
    [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
    UIView* focusView = context.nextFocusedView;
    NSString* nextFocusGroup = context.nextFocusedView.focusGroupIdentifier;
    NSString* testGroup = [self getFocusGroupIdentifierForView: focusView];
    BOOL isFocused = [nextFocusGroup isEqual: _customGroupId];
    if(_isGroupFocused != isFocused){
        _isGroupFocused = isFocused;
        [self onFocusChangeHandler: isFocused];
    }
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    if (@available(iOS 14.0, *)) {
        if(_customGroupId) {
            self.focusGroupIdentifier = _customGroupId;
        }
    }
}

- (void)onFocusChangeHandler:(BOOL) isFocused {
    if(self.onGroupFocusChange) {
        self.onGroupFocusChange(@{ @"isFocused": @(isFocused) });
    }
}


#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<KeyboardFocusGroupComponentDescriptor>();
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _customGroupId = nil;
    self.tintColor = nil;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<KeyboardFocusGroupProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<KeyboardFocusGroupProps const>(props);
    [super updateProps
     :props oldProps:oldProps];
    
    if(oldViewProps.tintColor != newViewProps.tintColor) {
        self.tintColor = RCTUIColorFromSharedColor(newViewProps.tintColor);
    }
    
    if(oldViewProps.groupIdentifier != newViewProps.groupIdentifier) {
        NSString *newGroupId = [NSString stringWithUTF8String:newViewProps.groupIdentifier.c_str()];
        [self setCustomGroupId:newGroupId];
    }
    
}


Class<RCTComponentViewProtocol> KeyboardFocusGroupCls(void)
{
    return RNCEKVKeyboardFocusGroup.class;
}


#endif



@end




