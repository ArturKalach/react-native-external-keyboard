#import "RNCEKVExternalKeyboardView.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import "RNCEKVKeyboardKeyPressHandler.h"
#import "RNCEKVPreferredFocusEnvironment.h"
#import "RNCEKVKeyboardFocusDelegate.h"

#ifdef RCT_NEW_ARCH_ENABLED
#include <string>
#import <react/renderer/components/RNExternalKeyboardViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/EventEmitters.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/Props.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import "RNCEKVFabricEventHelper.h"

using namespace facebook::react;

@interface RNCEKVExternalKeyboardView () <RCTExternalKeyboardViewViewProtocol>

@end

#endif

@implementation RNCEKVExternalKeyboardView {
    RNCEKVKeyboardKeyPressHandler* _keyboardKeyPressHandler;
    RNCEKVKeyboardFocusDelegate* _keyboardFocusDelegate;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
#ifdef RCT_NEW_ARCH_ENABLED
        static const auto defaultProps = std::make_shared<const ExternalKeyboardViewProps>();
        _props = defaultProps;
#endif
        _keyboardKeyPressHandler = [[RNCEKVKeyboardKeyPressHandler alloc] init];
        _keyboardFocusDelegate =  [[RNCEKVKeyboardFocusDelegate alloc] initWithView:self];
        
        if (@available(iOS 13.0, *)) {
            UIContextMenuInteraction *interaction = [[UIContextMenuInteraction alloc] initWithDelegate: self];
            [self addInteraction: interaction];
        }
    }
    
    return self;
}



#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ExternalKeyboardViewComponentDescriptor>();
}


- (void)prepareForRecycle
{
    [super prepareForRecycle];
    [self cleanReferences];
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

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<ExternalKeyboardViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<ExternalKeyboardViewProps const>(props);
    [super updateProps
     :props oldProps:oldProps];
    
    if(_hasOnFocusChanged != newViewProps.hasOnFocusChanged) {
        [self setHasOnFocusChanged: newViewProps.hasOnFocusChanged];
    }
    
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
    
    if(oldViewProps.enableHaloEffect != newViewProps.enableHaloEffect) {
        //        _haloEnabled = newViewProps.enableHaloEffect;
        //        [self setHaloEffect: newViewProps.enableHaloEffect];
    }
}


Class<RCTComponentViewProtocol> ExternalKeyboardViewCls(void)
{
    return RNCEKVExternalKeyboardView.class;
}


#endif

//ToDo remove after new system migration
- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
    if (self.myPreferredFocusedView == nil) {
        return @[];
    }
    return @[self.myPreferredFocusedView];
}

- (BOOL)canBecomeFocused {
    return [_keyboardFocusDelegate canBecomeFocused];
}

- (void)willMoveToSuperview:(UIView *)newSuperview {
    [super willMoveToSuperview:newSuperview];
    [_keyboardFocusDelegate willMoveToSuperview:newSuperview];
}


- (void)focus:(NSString *)rootViewId {
    UIView *focusingView = [_keyboardFocusDelegate getFocusingView];
    [[RNCEKVPreferredFocusEnvironment sharedInstance] focus:focusingView withRootId:rootViewId];
}


- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
    if([self hasOnFocusChanged]) {
        NSNumber* isFocusChanged = [_keyboardFocusDelegate isFocusChanged: context];
        if(isFocusChanged != nil) {
            [self onFocusChangeHandler: [isFocusChanged  isEqual: @YES]];
        }
        
        return;
    }
    
    [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
}




#ifdef RCT_NEW_ARCH_ENABLED
- (void)onContextMenuPressHandler {
    [RNCEKVFabricEventHelper onContextMenuPressEventEmmiter:_eventEmitter];
}

- (void)onFocusChangeHandler:(BOOL) isFocused {
    [RNCEKVFabricEventHelper onFocusChangeEventEmmiter:isFocused withEmitter:_eventEmitter];
}

- (void)onKeyDownPressHandler:(NSDictionary*) eventInfo{
    [RNCEKVFabricEventHelper onKeyDownPressEventEmmiter:eventInfo withEmitter:_eventEmitter];
}

- (void)onKeyUpPressHandler:(NSDictionary*) eventInfo{
    [RNCEKVFabricEventHelper onKeyUpPressEventEmmiter:eventInfo withEmitter:_eventEmitter];
}

#else

- (void)onContextMenuPressHandler {
    if(self.onContextMenuPress) {
        self.onContextMenuPress(@{});
    }
}

- (void)onFocusChangeHandler:(BOOL) isFocused {
    if(self.onFocusChange) {
        self.onFocusChange(@{ @"isFocused": @(isFocused) });
    }
}

- (void)onKeyDownPressHandler:(NSDictionary*) eventInfo{
    if(self.onKeyDownPress) {
        self.onKeyDownPress(eventInfo);
    }
}

- (void)onKeyUpPressHandler:(NSDictionary*) eventInfo{
    if(self.onKeyUpPress) {
        self.onKeyUpPress(eventInfo);
    }
}

#endif


- (void)pressesBegan:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    if(self.hasOnPressUp || self.hasOnPressDown) {
        NSDictionary *eventInfo = [_keyboardKeyPressHandler actionDownHandler:presses withEvent:event];
        [self onKeyDownPressHandler: eventInfo];
        
        return;
    }
    
    [super pressesBegan:presses withEvent:event];
}

- (void)pressesEnded:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    if(self.hasOnPressUp || self.hasOnPressDown) {
        NSDictionary *eventInfo = [_keyboardKeyPressHandler actionUpHandler:presses withEvent:event];
        [self onKeyUpPressHandler: eventInfo];
        
        return;
    }
    
    [super pressesEnded:presses withEvent:event];
}

- (void)setIsHaloActive:(NSNumber * _Nullable)isHaloActive {
    _isHaloActive = isHaloActive;
    [_keyboardFocusDelegate updateHalo];
}

- (void)didMoveToSuperview {
    [super didMoveToSuperview];
    
    if (self.superview != nil && _autoFocusRootId) {
        [[RNCEKVPreferredFocusEnvironment sharedInstance] setAutoFocus:self withRootId: _autoFocusRootId];
    }
}

- (void)addSubview:(UIView *)view {
    [super addSubview:view];
    [_keyboardFocusDelegate addSubview: view];
}

- (UIContextMenuConfiguration *)contextMenuInteraction:(UIContextMenuInteraction *)interaction configurationForMenuAtLocation:(CGPoint)location API_AVAILABLE(ios(13.0)){
    [self onContextMenuPressHandler];
    return nil;
}

- (NSString*) getFocusGroupIdentifier {
#ifdef RCT_NEW_ARCH_ENABLED
    return  [NSString stringWithFormat:@"app.group.%ld", self.tag];
#else
    return [NSString stringWithFormat:@"app.group.%@", self.reactTag];
#endif
}



@end




