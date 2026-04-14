#import "RNCEKVTextInputFocusWrapper.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import <React/RCTLog.h>
#import <React/RCTUITextView.h>
#import "RNCEKVFocusEffectUtility.h"
#import "RCTBaseTextInputView.h"
#import "RNCEKVOrderLinking.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"

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

#import <React/RCTConversions.h>

#import "RNCEKVPropHelper.h"
#import "RCTViewComponentView+RNCEKVExternalKeyboard.h"
#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RNCEKVTextInputFocusWrapper () <RCTTextInputFocusWrapperViewProtocol>

@end

#endif

static const NSInteger AUTO_FOCUS = 2;
static const NSInteger AUTO_BLUR = 2;

@implementation RNCEKVTextInputFocusWrapper

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
#ifdef RCT_NEW_ARCH_ENABLED
        static const auto defaultProps = std::make_shared<const TextInputFocusWrapperProps>();
        _props = defaultProps;
#endif
    }

    return self;
}


#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<TextInputFocusWrapperComponentDescriptor>();
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

    [self updateGroupIdentifierProps:RNCEKV::GroupIdentifierProps::from(oldViewProps)
                            newProps:RNCEKV::GroupIdentifierProps::from(newViewProps)];

    [self updateHaloProps:RNCEKV::HaloProps::from(oldViewProps)
                 newProps:RNCEKV::HaloProps::from(newViewProps)];
    [self updateFocusOrderProps:RNCEKV::OrderProps::from(oldViewProps)
                       newProps:RNCEKV::OrderProps::from(newViewProps)];

    UIColor* newColor = RCTUIColorFromSharedColor(newViewProps.tintColor);
    BOOL renewColor = newColor != nil && self.tintColor == nil;
    BOOL isColorChanged = oldViewProps.tintColor != newViewProps.tintColor;
    if(isColorChanged || renewColor) {
        self.tintColor = RCTUIColorFromSharedColor(newViewProps.tintColor);
    }

}

Class<RCTComponentViewProtocol> TextInputFocusWrapperCls(void)
{
    return RNCEKVTextInputFocusWrapper.class;
}

#endif


#ifdef RCT_NEW_ARCH_ENABLED

- (void)onFocusChangeHandler:(BOOL) isFocused {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<TextInputFocusWrapperEventEmitter const>(_eventEmitter);
        facebook::react::TextInputFocusWrapperEventEmitter::OnFocusChange data = {
            .isFocused = isFocused,
        };
        viewEventEmitter->onFocusChange(data);
    };
}

- (void)onMultiplyTextSubmitHandler: (RCTUITextView*) textView {
    if (_eventEmitter) {
      NSString* text = textView != nil ? textView.attributedText.string : @"";
        auto viewEventEmitter = std::static_pointer_cast<TextInputFocusWrapperEventEmitter const>(_eventEmitter);
      facebook::react::TextInputFocusWrapperEventEmitter::OnMultiplyTextSubmit data = {
        .text = [text UTF8String]
      };
        viewEventEmitter->onMultiplyTextSubmit(data);
    };
}

#else


- (void)onFocusChangeHandler:(BOOL) isFocused {
    if(self.onFocusChange) {
        self.onFocusChange(@{ @"isFocused": @(isFocused) });
    }
}

- (void)onMultiplyTextSubmitHandler: (RCTUITextView*) textView {
    NSString* text = textView != nil ? textView.attributedText.string : @"";
    if(self.onMultiplyTextSubmit) {
      self.onMultiplyTextSubmit(@{ @"text": text });
    }
}

#endif

- (void)focus {
  UIViewController *viewController = self.reactViewController;
  [self updateFocus:viewController];
}

- (void)updateFocus:(UIViewController *)controller {
  UIView *focusingView = self.subviews.count ? self.subviews[0] : nil;
  if (self.superview != nil && controller != nil) {
    [controller rncekvFocusView:focusingView];
  }
}

- (BOOL)canBecomeFocused {
    return NO;
}

- (UIView*)getStoredView {
  return _textField;
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {

    if(_textField == nil) {
      _textField = [self getTextFieldComponent];
    }

    BOOL isNext = context.nextFocusedView == _textField;
    BOOL isPrev = context.previouslyFocusedView == _textField;

    if(isNext) {
      if(self.focusType == AUTO_FOCUS) {
        if(_textField != nil) {
          [_textField reactFocus];
        }
      }
    }

    if(isPrev) {
      if(self.blurType == AUTO_BLUR) {
        if(_textField != nil) {
          [_textField reactBlur];
        }
      }
    }

   [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
}

- (UIView*)getTextFieldComponent {
  @try{
    UIView* input = self.subviews[0];
    UIView* backedTextInputView = nil;

    #ifdef RCT_NEW_ARCH_ENABLED
        if([input isKindOfClass: [RCTTextInputComponentView class]]) {
          backedTextInputView = ((RCTTextInputComponentView *)input).rncekbBackedTextInputView;
        }
    #else
        if([input isKindOfClass: [RCTMultilineTextInputView class]]) {
          backedTextInputView = ((RCTMultilineTextInputView *)input).backedTextInputView;
        } else if([input isKindOfClass: [RCTSinglelineTextInputView class]]) {
          backedTextInputView = ((RCTSinglelineTextInputView *)input).backedTextInputView;
        }
    #endif

    return backedTextInputView;
  } @catch (NSException *ex) {
    return nil;
  }
}

- (void)cleanReferences{
    [super cleanReferences];
    _textField = nil;
    _textView = nil;
}

- (BOOL)getIsTextInputView: (UIView*)view {
#ifdef RCT_NEW_ARCH_ENABLED
    BOOL isTextInput = [view isKindOfClass: [RCTTextInputComponentView class]];
#else
    BOOL isTextInput = [view isKindOfClass: [RCTSinglelineTextInputView class]];
#endif
    return isTextInput;
}

- (void)pressesBegan:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    if (@available(iOS 13.4, *)) {
        UIKey *key = presses.allObjects[0].key;
        BOOL isEnter = [key.characters isEqualToString:@"\n"] || [key.characters isEqualToString:@"\r"];

        RCTUITextField* textView = _textField != nil ? _textField : [self getTextFieldComponent];
        if(isEnter && textView && !textView.isFirstResponder) {
            [_textField reactFocus];
            return;
        }

        if(self.multiline) {
            BOOL isShiftPressed = (key.modifierFlags & UIKeyModifierShift) != 0;

            if(textView && textView.isFirstResponder) {
                if(!isShiftPressed && isEnter) {
                    [self onMultiplyTextSubmitHandler: (UIView*)textView];
                    if(self.blurOnSubmit) {
                        [textView resignFirstResponder];
                    }
                }
            }
        }
    }

    [super pressesBegan:presses withEvent:event];
}


- (UIView*)getFocusTargetView {
  if(_textField != nil) {
    return _textField;
  }
  if(self.subviews.count > 0 && self.subviews[0].subviews.count > 0) {
    UIView* focusingView = self.subviews[0].subviews[0];
    return focusingView;
  }

  return nil;
}

@end
