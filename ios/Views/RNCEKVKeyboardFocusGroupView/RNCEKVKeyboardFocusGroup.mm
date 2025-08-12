//
//  TintColorView.m
//  Pods
//
//  Created by Artur Kalach on 24/12/2024.
//

#import "RNCEKVKeyboardFocusGroup.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import "RNCEKVOrderLinking.h"
#import "RNCEKVRelashioship.h"
#import "RNCEKVExternalKeyboardView.h"

#ifdef RCT_NEW_ARCH_ENABLED
#include <string>
#import "RCTViewComponentView+RNCEKVExternalKeyboard.h"
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

- (void )setCustomGroupId: (NSString *) customGroupId {
    if (@available(iOS 14.0, *)) {
        _customGroupId = customGroupId;
        [self updateFocusGroup: customGroupId];
    }
}


- (void )updateFocusGroup: (NSString *) customGroupId {
    if (@available(iOS 14.0, *)) {
      #ifdef RCT_NEW_ARCH_ENABLED
        self.rncekvCustomGroup = _customGroupId;
      #else
        self.focusGroupIdentifier = _customGroupId;
      #endif
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
    self.tintColor = nil;
    [self updateFocusGroup: nil];
    _customGroupId = nil;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<KeyboardFocusGroupProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<KeyboardFocusGroupProps const>(props);
    [super updateProps
     :props oldProps:oldProps];


    UIColor* newColor = RCTUIColorFromSharedColor(newViewProps.tintColor);
    BOOL isDifferentColor = ![newColor isEqual: self.tintColor];
    BOOL renewColor = newColor != nil && self.tintColor == nil;
    BOOL isColorChanged = oldViewProps.tintColor != newViewProps.tintColor;
    if(isColorChanged || renewColor || isDifferentColor) {
        self.tintColor = newColor;
    }

      if(oldViewProps.groupIdentifier != newViewProps.groupIdentifier || !self.customGroupId) {
      if(newViewProps.groupIdentifier.empty()) {
        [self setCustomGroupId:nil];
      } else {
        NSString *newGroupId = [NSString stringWithUTF8String:newViewProps.groupIdentifier.c_str()];
        [self setCustomGroupId:newGroupId];
      }
    }
}

Class<RCTComponentViewProtocol> KeyboardFocusGroupCls(void)
{
    return RNCEKVKeyboardFocusGroup.class;
}


#endif



@end
