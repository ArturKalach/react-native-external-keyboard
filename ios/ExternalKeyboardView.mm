#import "ExternalKeyboardView.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import <React/RCTLog.h>
#import "KeyboardKeyPressHandler/KeyboardKeyPressHandler.h"

#ifdef RCT_NEW_ARCH_ENABLED

#import "FocusWrapper/FocusWrapper.h"
#import <react/renderer/components/RNExternalKeyboardViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/EventEmitters.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/Props.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface ExternalKeyboardView () <RCTExternalKeyboardViewViewProtocol>

@end

@implementation ExternalKeyboardView {
    FocusWrapper * _view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ExternalKeyboardViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const ExternalKeyboardViewProps>();
        _props = defaultProps;
        
        _view = [[FocusWrapper alloc] init];
        _view.onFocusChange = [self](NSDictionary* dictionary) {
            if (_eventEmitter) {
                auto viewEventEmitter = std::static_pointer_cast<ExternalKeyboardViewEventEmitter const>(_eventEmitter);
                facebook::react::ExternalKeyboardViewEventEmitter::OnFocusChange data = {
                    .isFocused = [[dictionary valueForKey:@"isFocused"] boolValue],
                };
                viewEventEmitter->onFocusChange(data);
            };
        };
        
        _view.onKeyDownPress = [self](NSDictionary* dictionary) {
            if (_eventEmitter) {
                auto viewEventEmitter = std::static_pointer_cast<ExternalKeyboardViewEventEmitter const>(_eventEmitter);
                facebook::react::ExternalKeyboardViewEventEmitter::OnKeyDownPress data = {
                    .keyCode = [[dictionary valueForKey:@"keyCode"] intValue],
                    .isLongPress = [[dictionary valueForKey:@"isLongPress"] boolValue],
                    .isAltPressed = [[dictionary valueForKey:@"isAltPressed"] boolValue],
                    .isShiftPressed = [[dictionary valueForKey:@"isShiftPressed"] boolValue],
                    .isCtrlPressed = [[dictionary valueForKey:@"isCtrlPressed"] boolValue],
                    .isCapsLockOn = [[dictionary valueForKey:@"isCapsLockOn"] boolValue],
                    .hasNoModifiers = [[dictionary valueForKey:@"hasNoModifiers"] boolValue],
                };
                viewEventEmitter->onKeyDownPress(data);
            };
        };
        
        
        _view.onKeyUpPress = [self](NSDictionary* dictionary) {
            if (_eventEmitter) {
                auto viewEventEmitter = std::static_pointer_cast<ExternalKeyboardViewEventEmitter const>(_eventEmitter);
                facebook::react::ExternalKeyboardViewEventEmitter::OnKeyUpPress data = {
                    .keyCode = [[dictionary valueForKey:@"keyCode"] intValue],
                    .isLongPress = [[dictionary valueForKey:@"isLongPress"] boolValue],
                    .isAltPressed = [[dictionary valueForKey:@"isAltPressed"] boolValue],
                    .isShiftPressed = [[dictionary valueForKey:@"isShiftPressed"] boolValue],
                    .isCtrlPressed = [[dictionary valueForKey:@"isCtrlPressed"] boolValue],
                    .isCapsLockOn = [[dictionary valueForKey:@"isCapsLockOn"] boolValue],
                    .hasNoModifiers = [[dictionary valueForKey:@"hasNoModifiers"] boolValue],
                };
                viewEventEmitter->onKeyUpPress(data);
            };
        };
        
        self.contentView = _view;
    }
    
    return self;
}

- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
    if (self.myPreferredFocusedView == nil) {
        return @[];
    }
    return @[self.myPreferredFocusedView];
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<ExternalKeyboardViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<ExternalKeyboardViewProps const>(props);

    if (@available(iOS 14.0, *)) {
        if(_view.focusGroupIdentifier == nil) {
            _view.focusGroupIdentifier =  [NSString stringWithFormat:@"app.group.%ld", self.tag];
        }
    }
    
    [super updateProps:props oldProps:oldProps];
    
    
    if(oldViewProps.canBeFocused != newViewProps.canBeFocused) {
        [_view setCanBeFocused: newViewProps.canBeFocused];
    }
    
}

Class<RCTComponentViewProtocol> ExternalKeyboardViewCls(void)
{
    return ExternalKeyboardView.class;
}

@end
#else

@implementation ExternalKeyboardView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        _keyboardKeyPressHandler = [[KeyboardKeyPressHandler alloc] init];
    }
    
    return self;
    
}

- (void)pressesBegan:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    NSDictionary *eventInfo = [_keyboardKeyPressHandler actionDownHandler:presses withEvent:event];
    if(self.onKeyDownPress) {
        self.onKeyDownPress(eventInfo);
    }
}

- (void)pressesEnded:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    NSDictionary *eventInfo = [_keyboardKeyPressHandler actionUpHandler:presses withEvent:event];
    if(self.onKeyUpPress) {
        self.onKeyUpPress(eventInfo);
    }
}

- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
    if (self.myPreferredFocusedView == nil) {
        return @[];
    }
    return @[self.myPreferredFocusedView];
}
- (BOOL)canBecomeFocused {
    return self.canBeFocused;
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
    if(!self.onFocusChange) {
        return;
    }
    
    if(context.nextFocusedView == self) {
        self.onFocusChange(@{ @"isFocused": @(YES) });
    } else if (context.previouslyFocusedView == self) {
        self.onFocusChange(@{ @"isFocused": @(NO) });
    }
}

- (void)didUpdateReactSubviews
{
    [super didUpdateReactSubviews];
    if (@available(iOS 14.0, *)) {
        self.focusGroupIdentifier =  [NSString stringWithFormat:@"app.group.%@", self.reactTag];
    }
}

@end

#endif

