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
#import "RNCEKVExternalKeyboardView.h"

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

@implementation RNCEKVKeyboardFocusGroup

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        _isGroupFocused = false;
        static const auto defaultProps = std::make_shared<const KeyboardFocusGroupProps>();
        _props = defaultProps;
    }

    return self;
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {

    [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
    if (@available(iOS 14.0, *)) {
        NSString* nextFocusGroup = context.nextFocusedView.focusGroupIdentifier;
        BOOL isFocused = [nextFocusGroup isEqual: _customGroupId];
    
        if(_isGroupFocused != isFocused){
            _isGroupFocused = isFocused;
            [self onFocusChangeHandler: isFocused];
        }
    }
}

- (void)onFocusChangeHandler:(BOOL) isFocused {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<KeyboardFocusGroupEventEmitter const>(_eventEmitter);
        facebook::react::KeyboardFocusGroupEventEmitter::OnGroupFocusChange data = {
            .isFocused = isFocused,
        };
        viewEventEmitter->onGroupFocusChange(data);
    };
}

- (void )setCustomGroupId: (NSString *) customGroupId {
    if (@available(iOS 14.0, *)) {
        _customGroupId = customGroupId;
    }
}



+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<KeyboardFocusGroupComponentDescriptor>();
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    self.tintColor = nil;
//    [self updateFocusGroup: nil];
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

@end
