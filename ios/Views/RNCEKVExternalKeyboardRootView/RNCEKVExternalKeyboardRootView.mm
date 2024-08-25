//
//  RNCEKVExternalKeyboardRootView.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 13/08/2024.
//

#import "RNCEKVExternalKeyboardRootView.h"
#import "RNCEKVPreferredFocusEnvironment.h"
#import "RNCEKVAutoFocus.h"
#import "RCTUtils.h"

#ifdef RCT_NEW_ARCH_ENABLED

#import <react/renderer/components/RNExternalKeyboardViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/EventEmitters.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/Props.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/RCTComponentViewHelpers.h>
#import "RCTModalViewController+Focus.h"
#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RNCEKVExternalKeyboardRootView () <RCTExternalKeyboardRootViewViewProtocol, UIFocusEnvironment>

@end

#else

#import "RCTModalHostViewController.h"

#endif



@implementation RNCEKVExternalKeyboardRootView {
    BOOL _isModalChecked;
}

- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
    if (self.customFocusedView == nil) {
        return nil;
    }
    return @[self.customFocusedView];
}

- (void)cleanReferences {
    [self setCustomFocusedView: nil];
    if(self.viewId != nil) {
        [[RNCEKVPreferredFocusEnvironment sharedInstance] detachRootView: self.viewId];
    }
    _isModalChecked = NO;
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)prepareForRecycle
{
    [super prepareForRecycle];
    [self cleanReferences];
   
}
#else
- (void)willMoveToSuperview:(UIView *)newSuperview {
    [super willMoveToSuperview:newSuperview];
    if (newSuperview == nil) {
        [self cleanReferences];
    }
}
#endif

- (void)focusView:(UIView*) view {
    if([view canBecomeFocused]) {
        [self setCustomFocusedView: view];
        [self setNeedsFocusUpdate];
        [self updateFocusIfNeeded];
    }
}

- (void)setAutoFocus:(UIView*) view {
    if([view canBecomeFocused]) {
        [self setCustomFocusedView: view];
    }
}

- (void)didMoveToWindow {
    [super didMoveToWindow];
    
    if (_isModalChecked || self.window == nil) {
        return;
    }
    
    UIViewController *presentedViewController = RCTPresentedViewController();

    #ifdef RCT_NEW_ARCH_ENABLED
        BOOL isKindOfModal = [presentedViewController isKindOfClass:[RCTFabricModalHostViewController class]];
    #else
        BOOL isKindOfModal = [presentedViewController isKindOfClass:[RCTModalHostViewController class]];
    #endif

    if(isKindOfModal) {
        _isModalChecked = YES;
        [[RNCEKVAutoFocus sharedInstance] setFocusView: self];
    }
}

#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ExternalKeyboardRootViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const ExternalKeyboardRootViewProps>();
        _props = defaultProps;
        _isModalChecked = NO;
    }
    
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<ExternalKeyboardRootViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<ExternalKeyboardRootViewProps const>(props);
    [super updateProps
     :props oldProps:oldProps];
    
    if(oldViewProps.viewId != newViewProps.viewId) {
        NSString *rootViewId = [NSString stringWithUTF8String:newViewProps.viewId.c_str()];
        
        if(_viewId) {
            NSString *oldViewId = [NSString stringWithUTF8String:oldViewProps.viewId.c_str()];
            [[RNCEKVPreferredFocusEnvironment sharedInstance] detachRootView:oldViewId];
        }

        [[RNCEKVPreferredFocusEnvironment sharedInstance] storeRootView: rootViewId withView: self];
        [self setViewId: rootViewId];
    }
}

Class<RCTComponentViewProtocol> ExternalKeyboardRootViewCls(void)
{
    return RNCEKVExternalKeyboardRootView.class;
}

#endif

@end
