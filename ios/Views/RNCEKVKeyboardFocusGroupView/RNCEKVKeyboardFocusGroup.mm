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
    [UIFocusDebugger focusGroupsForEnvironment: self];
    
    

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




