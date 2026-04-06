#import "RNCEKVTextInputFocusWrapper.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import <React/RCTLog.h>
#import <React/RCTUITextView.h>
#import "RNCEKVFocusEffectUtility.h"
#import "RCTBaseTextInputView.h"
#import "RNCEKVFocusOrderDelegate.h"
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

@implementation RNCEKVTextInputFocusWrapper {
  RNCEKVFocusOrderDelegate *_focusOrderDelegate;
  BOOL _isLinked;
  BOOL _isIdLinked;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
#ifdef RCT_NEW_ARCH_ENABLED
        static const auto defaultProps = std::make_shared<const TextInputFocusWrapperProps>();
        _props = defaultProps;
#endif
        _focusOrderDelegate = [[RNCEKVFocusOrderDelegate alloc] initWithView:self];
        _isLinked = NO;
        _isIdLinked = NO;
    }

    return self;
}


#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<TextInputFocusWrapperComponentDescriptor>();
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

    UIColor* newColor = RCTUIColorFromSharedColor(newViewProps.tintColor);
    BOOL renewColor = newColor != nil && self.tintColor == nil;
    BOOL isColorChanged = oldViewProps.tintColor != newViewProps.tintColor;
    if(isColorChanged || renewColor) {
        self.tintColor = RCTUIColorFromSharedColor(newViewProps.tintColor);
    }

    BOOL isLockChanged = [RNCEKVPropHelper isPropChanged:_lockFocus intValue: newViewProps.lockFocus];
    if(isLockChanged) {
      NSNumber* lockValue = [RNCEKVPropHelper unwrapIntValue: newViewProps.lockFocus];
      [self setLockFocus: lockValue];
    }


    BOOL isIndexChanged = [RNCEKVPropHelper isPropChanged:_orderPosition intValue: newViewProps.orderIndex];
    if(isIndexChanged) {
        NSNumber* position = [RNCEKVPropHelper unwrapIntValue: newViewProps.orderIndex];
        [self updateOrderPosition: position];
    }

    RKNA_PROP_UPDATE(orderGroup, setOrderGroup, newViewProps);
    RKNA_PROP_UPDATE(orderId, setOrderId, newViewProps);
    RKNA_PROP_UPDATE(orderLeft, setOrderLeft, newViewProps);
    RKNA_PROP_UPDATE(orderRight, setOrderRight, newViewProps);
    RKNA_PROP_UPDATE(orderUp, setOrderUp, newViewProps);
    RKNA_PROP_UPDATE(orderDown, setOrderDown, newViewProps);
    RKNA_PROP_UPDATE(orderForward, setOrderForward, newViewProps);
    RKNA_PROP_UPDATE(orderBackward, setOrderBackward, newViewProps);
    RKNA_PROP_UPDATE(orderLast, setOrderLast, newViewProps);
    RKNA_PROP_UPDATE(orderFirst, setOrderFirst, newViewProps);
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


- (void)onFocusChange:(BOOL) isFocused {
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
    controller.rncekvCustomFocusView = focusingView;
    dispatch_async(dispatch_get_main_queue(), ^{
      [controller setNeedsFocusUpdate];
      [controller updateFocusIfNeeded];
    });
  }
}

// Focus order linking

- (void)link {
    if(_orderPosition != nil && _orderGroup != nil && !_isLinked) {
        [[RNCEKVOrderLinking sharedInstance] add: _orderPosition withOrderKey: _orderGroup withObject:self];
        _isLinked = YES;
    }
    if(_orderId != nil) {
        [[RNCEKVOrderLinking sharedInstance] storeOrderId:_orderId withView: self];
        [_focusOrderDelegate linkId];
        _isIdLinked = YES;
    }
}

- (void)unlink {
    if(_orderPosition != nil && _orderGroup != nil && _isLinked) {
        [[RNCEKVOrderLinking sharedInstance] remove:_orderPosition withOrderKey: _orderGroup];
    }
    if(_orderId != nil) {
        [[RNCEKVOrderLinking sharedInstance] cleanOrderId:_orderId];
        [_focusOrderDelegate clear];
    }
    _isLinked = NO;
    _isIdLinked = NO;
}

- (void)setOrderGroup:(NSString *)orderGroup {
    if(_orderPosition != nil && self.superview != nil) {
        [[RNCEKVOrderLinking sharedInstance] updateOrderKey:(NSString *)_orderGroup next:orderGroup position:_orderPosition withView: self];
    }
    _orderGroup = orderGroup;
}

- (void)setOrderId:(NSString *)next {
    [_focusOrderDelegate refreshId:_orderId next:next];
    _orderId = next;
}

- (void)setOrderLeft:(NSString *)orderLeft {
    [_focusOrderDelegate refreshLeft: _orderLeft next: orderLeft];
    _orderLeft = orderLeft;
}

- (void)setOrderRight:(NSString *)orderRight {
    [_focusOrderDelegate refreshRight: _orderRight next: orderRight];
    _orderRight = orderRight;
}

- (void)setOrderUp:(NSString *)orderUp {
    [_focusOrderDelegate refreshUp: _orderUp next: orderUp];
    _orderUp = orderUp;
}

- (void)setOrderDown:(NSString *)orderDown {
    [_focusOrderDelegate refreshDown: _orderDown next: orderDown];
    _orderDown = orderDown;
}

- (void)updateOrderPosition:(NSNumber *)position {
    if(_orderPosition != nil || _orderPosition != position) {
        if(_orderGroup != nil && self.superview != nil && _isLinked) {
            [[RNCEKVOrderLinking sharedInstance] update:position lastPosition:_orderPosition withOrderKey: _orderGroup withView: self];
        }
        _orderPosition = position;
    }

    if(_orderPosition == nil && _orderPosition != position) {
        _orderPosition = position;
    }
}

- (BOOL)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
    if(!_orderGroup && !_orderPosition && !_lockFocus && !_orderForward && !_orderBackward) {
        return [super shouldUpdateFocusInContext: context];
    }

    NSNumber* result = [_focusOrderDelegate shouldUpdateFocusInContext: context];
    if(result == nil) {
        return [super shouldUpdateFocusInContext: context];
    }

    return result.boolValue;
}

// ToDo RNCEKV-3, if we return yes here, it means that wrapper is focusable, with current implementation it works as expected, but it would be better to double check
- (BOOL)canBecomeFocused {
    return NO;
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {

    if(_textField == nil) {
      _textField = [self getTextFieldComponent];
    }

    BOOL isNext = context.nextFocusedView == _textField;
    BOOL isPrev = context.previouslyFocusedView == _textField;

    if(isNext) {
      [self onFocusChange: YES];
      [_focusOrderDelegate setIsFocused: YES];
      if(self.focusType == AUTO_FOCUS) {
        if(_textField != nil) {
          [_textField reactFocus];
        }
      }
    }

    if(isPrev) {
      [self onFocusChange: NO];
      [_focusOrderDelegate setIsFocused: NO];
      if(self.blurType == AUTO_BLUR) {
        if(_textField != nil) {
          [_textField reactBlur];
        }
      }
    }
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
    _textField = nil;
    _textView = nil;
    _customGroupId = nil;
    [self unlink];
    _orderGroup = nil;
    _orderPosition = nil;
    _orderLeft = nil;
    _orderRight = nil;
    _orderUp = nil;
    _orderDown = nil;
    _orderForward = nil;
    _orderBackward = nil;
    _orderLast = nil;
    _orderFirst = nil;
    _orderId = nil;
    _lockFocus = nil;
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

- (void)updateHalo {
    if(self.subviews.count == 0) {
        return;
    }

    UIView* view = self.subviews[0];
    if (@available(iOS 15.0, *)) {
        BOOL isTextInput = [self getIsTextInputView: view];
        if(isTextInput) {
          UIFocusEffect* focusEffect = [self isHaloHidden] ? [RNCEKVFocusEffectUtility emptyFocusEffect] : nil;
          #ifdef RCT_NEW_ARCH_ENABLED
          if([view.subviews[0] isKindOfClass: RCTViewComponentView.class]) {
            ((RCTViewComponentView*)view.subviews[0]).rncekvCustomFocusEffect = focusEffect;
          } else {
            view.subviews[0].focusEffect = focusEffect;
          }
          #else
          view.subviews[0].focusEffect = focusEffect;
          #endif
        }
    }
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

// ToDo, check if needed
- (void)didMoveToWindow {
  #ifndef RCT_NEW_ARCH_ENABLED
    [self updateHalo];
  #endif

  if (self.window) {
    [self link];
  } else {
    [self unlink];
  }
}



- (UIView*)getFocusTargetView {
  if(self.subviews.count > 0 && self.subviews[0].subviews.count > 0) {
    UIView* focusingView = self.subviews[0].subviews[0];
    return focusingView;
  }

  return nil;
}

- (void)willMoveToSuperview:(UIView *)newSuperview {
    [super willMoveToSuperview:newSuperview];

    if (newSuperview == nil) {
        [self cleanReferences];
    }
}

@end
