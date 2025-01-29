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
#import <react/renderer/components/RNExternalKeyboardViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/EventEmitters.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/Props.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/RCTComponentViewHelpers.h>

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

// - (NSString *)getFocusGroupIdentifierForView:(UIView *)view {
//     id<UIFocusEnvironment> focusEnvironment = view;
//     while (focusEnvironment) {
//         if ([focusEnvironment respondsToSelector:@selector(focusGroupIdentifier)]) {
//             NSString *focusGroupIdentifier = [focusEnvironment focusGroupIdentifier];
//             if (focusGroupIdentifier) {
//                 return focusGroupIdentifier;
//             }
//         }
//         focusEnvironment = focusEnvironment.parentFocusEnvironment;
//     }
//     return nil; // No focus group identifier found
// }

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
    
    [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
    NSString* nextFocusGroup = context.nextFocusedView.focusGroupIdentifier;
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

#ifdef RCT_NEW_ARCH_ENABLED

- (void)onFocusChangeHandler:(BOOL) isFocused {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<KeyboardFocusGroupEventEmitter const>(_eventEmitter);
        facebook::react::KeyboardFocusGroupEventEmitter::OnGroupFocusChange data = {
            .isFocused = isFocused,
        };
        viewEventEmitter->onGroupFocusChange(data);
    };
}

#else
- (void)onFocusChangeHandler:(BOOL) isFocused {
    if(self.onGroupFocusChange) {
        self.onGroupFocusChange(@{ @"isFocused": @(isFocused) });
    }
}
#endif


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




