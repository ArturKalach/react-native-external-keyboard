#import "RNCEKVExternalKeyboardView.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import "RNCEKVKeyboardKeyPressHandler.h"
#import "RNCEKVKeyboardFocusDelegate.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"

#ifdef RCT_NEW_ARCH_ENABLED
#include <string>
#import "RNCEKVHeaders.h"
#import "RCTFabricComponentsPlugins.h"
#import "RNCEKVFabricEventHelper.h"
#import <React/RCTConversions.h>

using namespace facebook::react;

@interface RNCEKVExternalKeyboardView () <RCTExternalKeyboardViewViewProtocol>

@end

#endif

@implementation RNCEKVExternalKeyboardView {
    RNCEKVKeyboardKeyPressHandler* _keyboardKeyPressHandler;
    RNCEKVKeyboardFocusDelegate* _keyboardFocusDelegate;
    NSNumber* _isFocused;
    BOOL _isAttachedToWindow;
    BOOL _isAttachedToController;
}

@synthesize haloCornerRadius = _haloCornerRadius;
@synthesize haloExpendX = _haloExpendX;
@synthesize haloExpendY = _haloExpendY;


- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
#ifdef RCT_NEW_ARCH_ENABLED
        static const auto defaultProps = std::make_shared<const ExternalKeyboardViewProps>();
        _props = defaultProps;
#endif
        _isAttachedToController = NO;
        _isAttachedToWindow = NO;
        _keyboardKeyPressHandler = [[RNCEKVKeyboardKeyPressHandler alloc] init];
        _keyboardFocusDelegate =  [[RNCEKVKeyboardFocusDelegate alloc] initWithView:self];
        if (@available(iOS 13.0, *)) {
            UIContextMenuInteraction *interaction = [[UIContextMenuInteraction alloc] initWithDelegate: self];
            [self addInteraction: interaction];
        }
    }
    
    return self;
}

- (void)cleanReferences{
    _isAttachedToController = NO;
    _isAttachedToWindow = NO;
    _isHaloActive = @2; //ToDo RNCEKV-0
    _haloExpendX = 0;
    _haloExpendY = 0;
    _haloCornerRadius = 0;
    _customGroupId = nil;
    self.focusGroupIdentifier = nil;
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
        [self focus];
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
        BOOL hasAutoFocus = newViewProps.autoFocus;
        [self setAutoFocus: hasAutoFocus];
    }
    
    if(oldViewProps.tintColor != newViewProps.tintColor) {
        self.tintColor = RCTUIColorFromSharedColor(newViewProps.tintColor);
    }
    
    if(oldViewProps.group != newViewProps.group) {
        [self setIsGroup: newViewProps.group];
    }
    
    if(oldViewProps.groupIdentifier != newViewProps.groupIdentifier) {
        NSString *newGroupId = [NSString stringWithUTF8String:newViewProps.groupIdentifier.c_str()];
        [self setCustomGroupId:newGroupId];
    }
    
    //ToDo RNCEKV-0, refactor, condition for halo effect has side effect, recycle is a question. The problem that we have to check the condition, (true means we skip, but when it was false we should reset) and recycle (view is reused and we need to double check whether a new place for view should be with or without halo)
    if(self.isHaloActive != nil || newViewProps.haloEffect == false) {
        BOOL haloState = newViewProps.haloEffect;
        if(![self.isHaloActive isEqual: @(haloState)]) {
            [self setIsHaloActive: @(haloState)];
        }
    }
    
    if(oldViewProps.haloExpendX != newViewProps.haloExpendX) {
        [self setHaloExpendX: newViewProps.haloExpendX];
    }
    
    if(oldViewProps.haloExpendY != newViewProps.haloExpendY) {
        [self setHaloExpendY: newViewProps.haloExpendY];
    }
    
    if(oldViewProps.haloCornerRadius != newViewProps.haloCornerRadius) {
        [self setHaloCornerRadius: newViewProps.haloCornerRadius];
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
    if(!_canBeFocused) NO;
    return [_keyboardFocusDelegate canBecomeFocused];
}

- (void)focus {
    UIViewController *viewController = self.reactViewController;
    [self updateFocus: viewController];
}

- (void)updateFocus: (UIViewController *) controller {
    UIView *focusingView = self; // [_keyboardFocusDelegate getFocusingView];
    
    if (self.superview != nil && controller != nil) {
        controller.customFocusView = focusingView;
        dispatch_async(dispatch_get_main_queue(), ^{
            [controller setNeedsFocusUpdate];
            [controller updateFocusIfNeeded];
        });
    }
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
    _isFocused = [_keyboardFocusDelegate isFocusChanged: context];

    if([self hasOnFocusChanged]) {
        if(_isFocused != nil) {
            _isAttachedToWindow = YES;
            _isAttachedToController = YES;
            [self onFocusChangeHandler: [_isFocused isEqual: @YES]];
        }
        
        return;
    }
    
    [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
}




#ifdef RCT_NEW_ARCH_ENABLED
- (void)onContextMenuPressHandler {
    [RNCEKVFabricEventHelper onContextMenuPressEventEmmiter:_eventEmitter];
}

- (void)onBubbledContextMenuPressHandler {
    [RNCEKVFabricEventHelper onBubbledContextMenuPressEventEmmiter:_eventEmitter];
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

- (void)onBubbledKeyDownPressHandler:(NSDictionary*) eventInfo{
    [RNCEKVFabricEventHelper onBubbledKeyDownPressEventEmmiter:eventInfo withEmitter:_eventEmitter];
}

- (void)onBubbledKeyUpPressHandler:(NSDictionary*) eventInfo{
    [RNCEKVFabricEventHelper onBubbledKeyUpPressEventEmmiter:eventInfo withEmitter:_eventEmitter];
}
#else

- (void)onContextMenuPressHandler {
    if(self.onContextMenuPress) {
        self.onContextMenuPress(@{});
    }
}

- (void)onBubbledContextMenuPressHandler {
    if(self.onBubbledContextMenuPress) {
        self.onBubbledContextMenuPress(@{});
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

- (void)onBubbledKeyDownPressHandler:(NSDictionary*) eventInfo{
    if(self.onBubbledKeyDownPress) {
        self.onBubbledKeyDownPress(eventInfo);
    }
}

- (void)onKeyUpPressHandler:(NSDictionary*) eventInfo{
    if(self.onKeyUpPress) {
        self.onKeyUpPress(eventInfo);
    }
}

- (void)onBubbledKeyUpPressHandler:(NSDictionary*) eventInfo{
    if(self.onBubbledKeyUpPress) {
        self.onBubbledKeyUpPress(eventInfo);
    }
}


#endif


- (void)pressesBegan:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    NSDictionary *eventInfo = [_keyboardKeyPressHandler actionDownHandler:presses withEvent:event];
    if(_isFocused != nil && [_isFocused isEqual:@YES]) {
        [self onBubbledKeyDownPressHandler: eventInfo];
    }
    
    if(self.hasOnPressUp || self.hasOnPressDown) {
        [self onKeyDownPressHandler: eventInfo];
        
        return;
    }
    
    [super pressesBegan:presses withEvent:event];
}

- (void)pressesEnded:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    NSDictionary *eventInfo = [_keyboardKeyPressHandler actionUpHandler:presses withEvent:event];
    if(_isFocused != nil && [_isFocused isEqual:@YES]) {
        [self onBubbledKeyUpPressHandler: eventInfo];
    }
    
    if(self.hasOnPressUp || self.hasOnPressDown) {
        [self onKeyUpPressHandler: eventInfo];
        
        return;
    }
    
    [super pressesEnded:presses withEvent:event];
}

- (void)setIsHaloActive:(NSNumber * _Nullable)isHaloActive {
    _isHaloActive = isHaloActive;
    [_keyboardFocusDelegate displayHalo];
}


- (void)setHaloCornerRadius:(CGFloat)haloCornerRadius {
    _haloCornerRadius = haloCornerRadius;
    if(_isAttachedToWindow) {
        [_keyboardFocusDelegate updateHalo];
    }
}

- (void)setHaloExpendX:(CGFloat)haloExpendX {
    _haloExpendX = haloExpendX;
    if(_isAttachedToWindow) {
        [_keyboardFocusDelegate updateHalo];
    }
}

- (void)setHaloExpendY:(CGFloat)haloExpendY {
    _haloExpendY = haloExpendY;
    if(_isAttachedToWindow) {
        [_keyboardFocusDelegate updateHalo];
    }
}

- (void)didMoveToWindow {
    [super didMoveToWindow];
    
    if (self.window) {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(viewControllerChanged:)
                                                     name:@"ViewControllerChangedNotification"
                                                   object:nil];
    } else {
        [[NSNotificationCenter defaultCenter] removeObserver:self name:@"ViewControllerChangedNotification" object:nil];
    }
    
    if(self.window && !_isAttachedToWindow) {
        [self onViewAttached];
        _isAttachedToWindow = YES;
    }
}

- (void)onViewAttached {
    if(self.autoFocus) {
        [self updateFocus: self.reactViewController];
    }
}

- (void)layoutSubviews {
    [super layoutSubviews];
    // ToDo RNCEKV-7 add cache for halo update
    if(self.bounds.size.width && self.bounds.size.height) {
      [_keyboardFocusDelegate updateHalo];
    }
    
    if (@available(iOS 14.0, *)) {
        UIView* focusingView = [_keyboardFocusDelegate getFocusingView];
        NSString* groupId = [self getFocusGroupIdentifier];
        focusingView.focusGroupIdentifier = groupId;
    }
}

- (void)viewControllerChanged:(NSNotification *)notification {
    UIViewController *viewController = notification.object;
    if (self.autoFocus && !_isAttachedToController) {
        _isAttachedToController = YES;
        [self updateFocus: viewController];
    }
}

- (void)addSubview:(UIView *)view {
    [super addSubview:view];
    [_keyboardFocusDelegate addSubview: view];
}

- (UIContextMenuConfiguration *)contextMenuInteraction:(UIContextMenuInteraction *)interaction configurationForMenuAtLocation:(CGPoint)location API_AVAILABLE(ios(13.0)){
    if(_isFocused != nil && [_isFocused isEqual:@YES]) {
        [self onContextMenuPressHandler];
        [self onBubbledContextMenuPressHandler];
    }

    return nil;
}

- (NSString*) getFocusGroupIdentifier {
    if(_customGroupId) {
        return _customGroupId;
    }
#ifdef RCT_NEW_ARCH_ENABLED
    return  [NSString stringWithFormat:@"app.group.%ld", self.tag];
#else
    return [NSString stringWithFormat:@"app.group.%@", self.reactTag];
#endif
}



@end




