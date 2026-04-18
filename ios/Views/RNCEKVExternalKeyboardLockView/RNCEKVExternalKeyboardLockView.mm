//
//  RNCEKVExternalKeyboardLockView.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 27/01/2026.
//

#import <Foundation/Foundation.h>
#import "UIViewController+RNCEKVExternalKeyboard.h"

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import "RNCEKVExternalKeyboardLockView.h"

#ifdef RCT_NEW_ARCH_ENABLED

#include <string>
#import <react/renderer/components/RNExternalKeyboardViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/EventEmitters.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/Props.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/RCTComponentViewHelpers.h>
#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RNCEKVExternalKeyboardLockView () <RCTExternalKeyboardLockViewViewProtocol>

@end

#endif



@implementation RNCEKVExternalKeyboardLockView

- (void)didMoveToSuperview {
  [super didMoveToSuperview];

  if (self.superview) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onAccessibilityFocusChanged:)
                                                 name:UIAccessibilityElementFocusedNotification
                                               object:nil];
  } else {
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIAccessibilityElementFocusedNotification
                                                  object:nil];
  }
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self
                                                  name:UIAccessibilityElementFocusedNotification
                                                object:nil];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)prepareForRecycle {
  [super prepareForRecycle];
  _forceLock = NO;
  _lockDisabled = NO;
  [[NSNotificationCenter defaultCenter] removeObserver:self
                                                  name:UIAccessibilityElementFocusedNotification
                                                object:nil];
}
#endif

- (void)onAccessibilityFocusChanged:(NSNotification *)notification {
  if (!_forceLock || _lockDisabled) return;

  id element = notification.userInfo[UIAccessibilityFocusedElementKey];
  if (![element isKindOfClass:[UIView class]]) return;

  UIView *focused = (UIView *)element;
  if (![focused isDescendantOfView:self]) {
    UIAccessibilityPostNotification(UIAccessibilityLayoutChangedNotification, self);
  }
}

- (void)setForceLock:(BOOL)forceLock {
  _forceLock = forceLock;
  [self requestFocus];
  [self requestScreenReaderFocus];
}

- (void)setLockDisabled:(BOOL)lockDisabled {
  _lockDisabled = lockDisabled;
  [self requestFocus];
  [self requestScreenReaderFocus];
}

- (BOOL)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
  if (_lockDisabled) {
    return [super shouldUpdateFocusInContext: context];
  }

  UIView *nextFocus = (UIView *)context.nextFocusedView;
  if(_forceLock && nextFocus != nil && ![nextFocus isDescendantOfView: self]) {
    return false;
  }

  return [super shouldUpdateFocusInContext: context];
}

- (void)requestFocus {
  if (!_forceLock && _lockDisabled) return;

  UIViewController *controller = self.reactViewController;
  if (controller != nil) {
    [controller rncekvFocusView: self];
  }
}

- (void)requestScreenReaderFocus {
  if (!_forceLock && _lockDisabled) return;

  UIAccessibilityPostNotification(UIAccessibilityLayoutChangedNotification, self);
}

#ifdef RCT_NEW_ARCH_ENABLED

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<ExternalKeyboardLockViewComponentDescriptor>();
}


- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ExternalKeyboardLockViewProps>();
    _props = defaultProps;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props
           oldProps:(Props::Shared const &)oldProps
{
  const auto &newViewProps =
    *std::static_pointer_cast<ExternalKeyboardLockViewProps const>(props);
  [super updateProps:props oldProps:oldProps];

  self.forceLock = newViewProps.forceLock;
  self.lockDisabled = newViewProps.lockDisabled;
}

Class<RCTComponentViewProtocol> ExternalKeyboardLockViewCls(void)
{
  return RNCEKVExternalKeyboardLockView.class;
}

#endif

- (void)didMoveToWindow {
  [super didMoveToWindow];

  if (self.window) {
    [self requestFocus];
    [self requestScreenReaderFocus];
  }
}

@end
