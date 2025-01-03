#import "RNCEKVTextInputFocusWrapper.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import <React/RCTLog.h>
#import <React/RCTUITextView.h>
#import "RNCEKVFocusEffectUtility.h"
#import "RCTBaseTextInputView.h"
#import "RNCEKVUtils.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCTTextInputComponentView+RNCEKVExternalKeyboard.h"
#import <React/RCTTextInputComponentView.h>
#else
#import <React/RCTSinglelineTextInputView.h>
#import <React/RCTMultilineTextInputView.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED

#include <string>
#import <react/renderer/components/RNExternalKeyboardViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/EventEmitters.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/Props.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/RCTComponentViewHelpers.h>


#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RNCEKVTextInputFocusWrapper () <RCTTextInputFocusWrapperViewProtocol>

@end

#endif

static const NSInteger AUTO_FOCUS = 2;
static const NSInteger AUTO_BLUR = 2;

// ToDo RNCEKV-6 TintColor for TextInput
@implementation RNCEKVTextInputFocusWrapper{
    
}

#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<TextInputFocusWrapperComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const TextInputFocusWrapperProps>();
        _props = defaultProps;
    }
    
    return self;
}

- (void)setIsHaloActive:(NSNumber * _Nullable)isHaloActive {
    _isHaloActive = isHaloActive;
    [self updateHalo];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    [self cleanReferences];
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<TextInputFocusWrapperProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<TextInputFocusWrapperProps const>(props);
    [super updateProps
     :props oldProps:oldProps];
    
    if(oldViewProps.canBeFocused != newViewProps.canBeFocused) {
        [self setCanBeFocused: newViewProps.canBeFocused];
    }
    
    if(oldViewProps.focusType != newViewProps.focusType) {
        [self setFocusType: newViewProps.focusType];
    }
    
    if(oldViewProps.blurType != newViewProps.blurType) {
        [self setBlurType: newViewProps.blurType];
    }
    
    if(oldViewProps.blurOnSubmit != newViewProps.blurOnSubmit) {
        [self setBlurOnSubmit: newViewProps.blurOnSubmit];
    }
    
    if(oldViewProps.multiline != newViewProps.multiline) {
        [self setMultiline: newViewProps.multiline];
    }

    if(self.isHaloActive != nil || newViewProps.haloEffect == false) {
        BOOL haloState = newViewProps.haloEffect;
        if(![self.isHaloActive isEqual: @(haloState)]) {
            [self setIsHaloActive: @(haloState)];
        }
    }
    
    if(oldViewProps.tintColor != newViewProps.tintColor) {
        NSString* tintColor = [NSString stringWithUTF8String:newViewProps.tintColor.c_str()];
        UIColor* resultColor = tintColor ? colorFromHexString(tintColor) : nil;
        self.tintColor = resultColor;
    }
}

Class<RCTComponentViewProtocol> TextInputFocusWrapperCls(void)
{
    return RNCEKVTextInputFocusWrapper.class;
}

#endif


#ifdef RCT_NEW_ARCH_ENABLED

- (void)onFocusChange:(BOOL) isFocused {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<TextInputFocusWrapperEventEmitter const>(_eventEmitter);
        facebook::react::TextInputFocusWrapperEventEmitter::OnFocusChange data = {
            .isFocused = isFocused,
        };
        viewEventEmitter->onFocusChange(data);
    };
}

- (void)onMultiplyTextSubmitHandler {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<TextInputFocusWrapperEventEmitter const>(_eventEmitter);
        facebook::react::TextInputFocusWrapperEventEmitter::OnMultiplyTextSubmit data = {};
        viewEventEmitter->onMultiplyTextSubmit(data);
    };
}

#else


- (void)onFocusChange:(BOOL) isFocused {
    if(self.onFocusChange) {
        self.onFocusChange(@{ @"isFocused": @(isFocused) });
    }
}

- (void)onMultiplyTextSubmitHandler {
    if(self.onMultiplyTextSubmit) {
        self.onMultiplyTextSubmit(@{});
    }
}

#endif

// ToDo RNCEKV-3, if we return yes here, it means that wrapper is focusable, with current implementation it works as expected, but it would be better to double check
- (BOOL)canBecomeFocused {
    return NO;
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
    BOOL isTextInputFocus = [context.nextFocusedView isKindOfClass: [RCTUITextField class]];
    if(isTextInputFocus && (_textField == nil || _textField == context.nextFocusedView)) {
        [self onFocusChange: YES];
        if(_textField == nil) {
            _textField = (RCTUITextField *)context.nextFocusedView;
        }
        if(self.focusType == AUTO_FOCUS) {
            [_textField reactFocus];
        }
    } else if (context.previouslyFocusedView == _textField) {
        [self onFocusChange: NO];
        if(self.blurType == AUTO_BLUR) {
            [_textField reactBlur];
        }
    }
}

- (void)cleanReferences{
    _textField = nil;
}

-(BOOL)isHaloHidden {
    NSNumber* isHaloActive = [self isHaloActive];
    return [isHaloActive isEqual: @NO];
}

- (BOOL)getIsTextInputView: (UIView*)view {
#ifdef RCT_NEW_ARCH_ENABLED
    BOOL isTextInput = [view isKindOfClass: [RCTTextInputComponentView class]];
#else
    BOOL isTextInput = [view isKindOfClass: [RCTSinglelineTextInputView class]];
#endif
    return isTextInput;
}

- (UIView*)getMultilineTextView: (UIView*)view {
    UIView* textView = nil;
#ifdef RCT_NEW_ARCH_ENABLED
    if([view isKindOfClass: [RCTTextInputComponentView class]]) {
        textView = ((RCTTextInputComponentView *)view).backedTextInputView;
    }
#else
    if([view isKindOfClass: [RCTMultilineTextInputView class]]) {
        textView = ((RCTMultilineTextInputView *)view).backedTextInputView;
    }
#endif
    return textView;
}

- (void)updateHalo {
    if(self.subviews.count == 0) {
        return;
    }
    
    UIView* view = self.subviews[0];
    if (@available(iOS 15.0, *)) {
        BOOL isTextInput = [self getIsTextInputView: view];
        if(isTextInput) {
            view.subviews[0].focusEffect = [self isHaloHidden] ? [RNCEKVFocusEffectUtility emptyFocusEffect] : nil;
        }
    }
}


- (void)pressesBegan:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    if (@available(iOS 13.4, *)) {
        if(self.multiline) {
            UIKey *key = presses.allObjects[0].key;
            
            BOOL isShiftPressed = (key.modifierFlags & UIKeyModifierShift) != 0;
            BOOL isEnter = [key.characters isEqualToString:@"\n"] || [key.characters isEqualToString:@"\r"];
            
            UIView* textView = [self getMultilineTextView: self.subviews[0]];
            if(textView && textView.isFirstResponder) {
                if(!isShiftPressed && isEnter) {
                    [self onMultiplyTextSubmitHandler];
                    if(self.blurOnSubmit) {
                        [textView resignFirstResponder];
                    }
                }
            }
        }
    }
    
    [super pressesBegan:presses withEvent:event];
}

// ToDo, check if needed
#ifndef RCT_NEW_ARCH_ENABLED
- (void)didMoveToWindow {
    [self updateHalo];
}
#endif


- (void)willMoveToSuperview:(UIView *)newSuperview {
    [super willMoveToSuperview:newSuperview];
    
    if (newSuperview == nil) {
        [self cleanReferences];
    }
}

@end
