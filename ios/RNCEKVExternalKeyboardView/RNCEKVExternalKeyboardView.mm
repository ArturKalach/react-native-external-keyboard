#import "RNCEKVExternalKeyboardView.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import "RNCEKVKeyboardKeyPressHandler.h"
#import "RNCEKVPreferredFocusEnvironment.h"

#ifdef RCT_NEW_ARCH_ENABLED
#include <string>
#import "RNCEKVFocusWrapper.h"
#import <react/renderer/components/RNExternalKeyboardViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/EventEmitters.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/Props.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"


using namespace facebook::react;

@interface RNCEKVExternalKeyboardView () <RCTExternalKeyboardViewViewProtocol>

@end

@implementation RNCEKVExternalKeyboardView {
    NSString* _autoFocus;
    RNCEKVKeyboardKeyPressHandler* _keyboardKeyPressHandler;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ExternalKeyboardViewComponentDescriptor>();
}

//ToDo remove after new system migration
- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
    if (self.myPreferredFocusedView == nil) {
        return @[];
    }
    return @[self.myPreferredFocusedView];
}

- (BOOL)canBecomeFocused {
    return [self getFocusingView] == self;
}

- (void)cleanReferences {
    [self setMyPreferredFocusedView: nil];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    [self cleanReferences];
}


- (void)focus:(NSString *)rootViewId {
    UIView *focusingView = [self getFocusingView];
    [[RNCEKVPreferredFocusEnvironment sharedInstance] focus:focusingView  withRootId: rootViewId];
}

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args {
    NSString *FOCUS = @"focus";
    if([commandName isEqual:FOCUS]) {
        if (args.count > 0 && [args.firstObject isKindOfClass:[NSString class]]) {
            NSString *rootViewId = (NSString *)args.firstObject;
            [self focus: rootViewId];
        }
    }
}

- (void)onContextMenuPress {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<ExternalKeyboardViewEventEmitter const>(_eventEmitter);
        facebook::react::ExternalKeyboardViewEventEmitter::OnContextMenuPress data = {};
        viewEventEmitter->onContextMenuPress(data);
    };
}

- (void)onFocusChange:(BOOL) isFocused {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<ExternalKeyboardViewEventEmitter const>(_eventEmitter);
        facebook::react::ExternalKeyboardViewEventEmitter::OnFocusChange data = {
            .isFocused = isFocused,
        };
        viewEventEmitter->onFocusChange(data);
    };
}

- (void)onKeyDownPress:(NSDictionary*) dictionary {
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
}


- (void)onKeyUpPress:(NSDictionary*) dictionary {
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
}


- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
    UIView* focusingView = [self getFocusingView];
    if(context.nextFocusedView == focusingView) {
        [self onFocusChange: YES];
    } else if (context.previouslyFocusedView == focusingView) {
        [self onFocusChange: NO];
    }
}

- (UIView*)getFocusingView {
    if(self.subviews.count == 1 && self.subviews[0].canBecomeFocused) {
        return self.subviews[0];
    }
    
    return self;
}


- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const ExternalKeyboardViewProps>();
        _props = defaultProps;
        _keyboardKeyPressHandler = [[RNCEKVKeyboardKeyPressHandler alloc] init];
        
        if (@available(iOS 13.0, *)) {
            UIContextMenuInteraction *interaction = [[UIContextMenuInteraction alloc] initWithDelegate: self];
            [self addInteraction: interaction];
        }
    }
    
    return self;
}

- (void)pressesBegan:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    if(self.hasOnPressUp || self.hasOnPressDown) {
        NSDictionary *eventInfo = [_keyboardKeyPressHandler actionDownHandler:presses withEvent:event];
        [self onKeyDownPress: eventInfo];
    }
    
    if(!self.hasOnPressUp) {
        [super pressesBegan:presses withEvent:event];
    }
}

- (void)pressesEnded:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    if(self.hasOnPressUp || self.hasOnPressDown) {
        NSDictionary *eventInfo = [_keyboardKeyPressHandler actionUpHandler:presses withEvent:event];
        [self onKeyUpPress: eventInfo];
    }
    if(!self.hasOnPressDown) {
        [super pressesEnded:presses withEvent:event];
    }
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<ExternalKeyboardViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<ExternalKeyboardViewProps const>(props);
    [super updateProps
     :props oldProps:oldProps];
    
    if(oldViewProps.canBeFocused != newViewProps.canBeFocused) {
        [self setCanBeFocused: newViewProps.canBeFocused];
    }
    
    if(oldViewProps.hasKeyUpPress != newViewProps.hasKeyUpPress) {
        [self setHasOnPressUp: newViewProps.hasKeyUpPress];
    }
    
    if(oldViewProps.hasKeyDownPress != newViewProps.hasKeyDownPress) {
        [self setHasOnPressDown: newViewProps.hasKeyDownPress];
    }
    
    
    if(oldViewProps.autoFocus != newViewProps.autoFocus) {
        _autoFocus = [NSString stringWithUTF8String:newViewProps.autoFocus.c_str()];
    }
    
    if(self.enableHaloEffect != newViewProps.enableHaloEffect) {
        [self setEnableHaloEffect: newViewProps.enableHaloEffect];
    }
    
    if (@available(iOS 14.0, *)) {
        if(self.focusGroupIdentifier == nil) {
            self.focusGroupIdentifier =  [NSString stringWithFormat:@"app.group.%ld", self.tag];
        }
    }
}

- (void)didMoveToSuperview {
    [super didMoveToSuperview];
    
    if (@available(iOS 15.0, *)) {
        if(self.superview != nil && !self.enableHaloEffect) {
            UIFocusHaloEffect *haloEffect = [UIFocusHaloEffect effectWithRect: CGRectMake(0,0,0,0)];
            self.focusEffect = haloEffect;
        }
    }

    if (self.superview != nil && _autoFocus) {
        [self setAutoFocus: _autoFocus];
    }
}


- (void)setAutoFocus:(nonnull NSString *)rootViewId {
    [[RNCEKVPreferredFocusEnvironment sharedInstance] setAutoFocus:self withRootId: _autoFocus];
}


- (UIContextMenuConfiguration *)contextMenuInteraction:(UIContextMenuInteraction *)interaction configurationForMenuAtLocation:(CGPoint)location  API_AVAILABLE(ios(13.0)){
    [self onContextMenuPress];
    return nil;
}


Class<RCTComponentViewProtocol> ExternalKeyboardViewCls(void)
{
    return RNCEKVExternalKeyboardView.class;
}

@end
#else

@implementation RNCEKVExternalKeyboardView {
    NSString* _autoFocus;
    RNCEKVKeyboardKeyPressHandler* _keyboardKeyPressHandler;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        _keyboardKeyPressHandler = [[RNCEKVKeyboardKeyPressHandler alloc] init];
        if (@available(iOS 13.0, *)) {
            UIContextMenuInteraction *interaction = [[UIContextMenuInteraction alloc] initWithDelegate: self];
            [self addInteraction: interaction];
        }
    }
    
    return self;
    
}

- (void)didMoveToSuperview {
    [super didMoveToSuperview];
    
    if (@available(iOS 15.0, *)) {
        if(self.superview != nil && !self.enableHaloEffect) {
            UIFocusHaloEffect *haloEffect = [UIFocusHaloEffect effectWithRect: CGRectMake(0,0,0,0)];
            self.focusEffect = haloEffect;
        }
    }
    
    if (self.superview != nil && _autoFocus) {
        [[RNCEKVPreferredFocusEnvironment sharedInstance] setAutoFocus:self withRootId: _autoFocus];
    }
}

- (UIContextMenuConfiguration *)contextMenuInteraction:(UIContextMenuInteraction *)interaction configurationForMenuAtLocation:(CGPoint)location  API_AVAILABLE(ios(13.0)){
    self.onContextMenuPress(@{});
    return nil;
}

- (void)setAutoFocus:(NSString *)rootViewId {
    _autoFocus = rootViewId;
}

- (void)pressesBegan:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    NSDictionary *eventInfo = [_keyboardKeyPressHandler actionDownHandler:presses withEvent:event];
    if(self.onKeyDownPress) {
        self.onKeyDownPress(eventInfo);
    } else {
        [super pressesBegan:presses withEvent:event];
    }
}

- (void)pressesEnded:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    NSDictionary *eventInfo = [_keyboardKeyPressHandler actionUpHandler:presses withEvent:event];
    if(self.onKeyUpPress) {
        self.onKeyUpPress(eventInfo);
    } else {
        [super pressesEnded:presses withEvent:event];
    }
}

- (void)focus:(NSString *)rootViewId {
    UIView *focusingView = [self getFocusingView];
    [[RNCEKVPreferredFocusEnvironment sharedInstance] focus:focusingView  withRootId: rootViewId];
}

- (UIView*)getFocusingView {
    if(self.subviews.count == 1 && self.subviews[0].canBecomeFocused) {
        return self.subviews[0];
    }
    
    return self;
}


- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
    if (self.myPreferredFocusedView == nil) {
        return @[];
    }
    return @[self.myPreferredFocusedView];
}

- (BOOL)canBecomeFocused {
    return [self getFocusingView] == self;
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
    if(!self.onFocusChange) {
        return;
    }
    
    UIView* focusingView = [self getFocusingView];
    if(context.nextFocusedView == focusingView) {
        self.onFocusChange(@{ @"isFocused": @(YES) });
    } else if (context.previouslyFocusedView == focusingView) {
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

