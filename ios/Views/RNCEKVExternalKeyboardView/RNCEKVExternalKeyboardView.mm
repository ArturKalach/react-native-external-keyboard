#import "RNCEKVExternalKeyboardView.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import "RNCEKVKeyboardKeyPressHandler.h"
#import "RNCEKVPreferredFocusEnvironment.h"
#import "RNCEKVKeyboardFocusDelegate.h"
#import "RNCEKVUtils.h"

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
    BOOL _isTouched;
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
        _isTouched = NO;
        if (@available(iOS 13.0, *)) {
            UIContextMenuInteraction *interaction = [[UIContextMenuInteraction alloc] initWithDelegate: self];
            [self addInteraction: interaction];
        }
    }
    
    return self;
}

- (void)cleanReferences{
    [self setAutoFocusRootId: nil];
    _isHaloActive = @2; //ToDo RNCEKV-0
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
        NSString* rootId = [NSString stringWithUTF8String:newViewProps.autoFocus.c_str()];
        [self setAutoFocusRootId: rootId];
    }
    
    if(oldViewProps.tintColor != newViewProps.tintColor) {
        NSString* tintColor = [NSString stringWithUTF8String:newViewProps.tintColor.c_str()];
        UIColor* resultColor = tintColor ? colorFromHexString(tintColor) : nil;
        self.tintColor = resultColor;
    }
    
    if(oldViewProps.group != newViewProps.group) {
        [self setIsGroup: newViewProps.group];
    }
    
    //ToDo RNCEKV-0, refactor, condition for halo effect has side effect, recycle is a question. The problem that we have to check the condition, (true means we skip, but when it was false we should reset) and recycle (view is reused and we need to double check whether a new place for view should be with or without halo)
    if(self.isHaloActive != nil || newViewProps.haloEffect == false) {
        BOOL haloState = newViewProps.haloEffect;
        if(![self.isHaloActive isEqual: @(haloState)]) {
            [self setIsHaloActive: @(haloState)];
        }
    }
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask {
    [super finalizeUpdates: updateMask];
    if(self.subviews.count > 0) {
        [_keyboardFocusDelegate addSubview: self.subviews[0]];
    }
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [super mountChildComponentView:childComponentView index:index];
}


Class<RCTComponentViewProtocol> ExternalKeyboardViewCls(void)
{
    return RNCEKVExternalKeyboardView.class;
}


#endif

//ToDo RNCEKV-DEPRICATED-0 remove after new system migration
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

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    [super touchesBegan:touches withEvent:event];
    _isTouched = YES;
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    [super touchesEnded:touches withEvent:event];
    _isTouched = NO;
}



- (UIContextMenuConfiguration *)contextMenuInteraction:(UIContextMenuInteraction *)interaction configurationForMenuAtLocation:(CGPoint)location API_AVAILABLE(ios(13.0)){
    if(!_isTouched) {
        [self onContextMenuPressHandler];
    }
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




