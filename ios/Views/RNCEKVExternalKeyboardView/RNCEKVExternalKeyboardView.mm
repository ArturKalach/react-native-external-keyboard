#import "RNCEKVExternalKeyboardView.h"
#import "RNCEKVFocusDelegate.h"
#import "RNCEKVGroupIdentifierDelegate.h"
#import "RNCEKVHaloDelegate.h"
#import "RNCEKVKeyboardKeyPressHandler.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>
#import "RNCEKVFocusOrderDelegate.h"
#import "RNCEKVOrderLinking.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/RNExternalKeyboardViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/EventEmitters.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/Props.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/RCTComponentViewHelpers.h>
#include <string>

#import "RNCEKVPropHelper.h"
#import "RCTFabricComponentsPlugins.h"
#import "RNCEKVFabricEventHelper.h"
#import <React/RCTConversions.h>
#import <stdlib.h>
#include "RNCEKVNativeProps.h"


using namespace facebook::react;

@interface RNCEKVExternalKeyboardView () <RCTExternalKeyboardViewViewProtocol>

@end

#endif

@implementation RNCEKVExternalKeyboardView

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
#ifdef RCT_NEW_ARCH_ENABLED
    static const auto defaultProps =
    std::make_shared<const ExternalKeyboardViewProps>();
    _props = defaultProps;
#endif
  }

  return self;
}

#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<
  ExternalKeyboardViewComponentDescriptor>();
}

- (void)prepareForRecycle {
  [super prepareForRecycle];
  [self cleanReferences];
}


- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args {
  NSString *FOCUS = @"focus";
  if ([commandName isEqual:FOCUS]) {
    [self focus];
  }
}

- (void)updateProps:(Props::Shared const &)props
           oldProps:(Props::Shared const &)oldProps {
  const auto &oldViewProps =
  *std::static_pointer_cast<ExternalKeyboardViewProps const>(_props);
  const auto &newViewProps =
  *std::static_pointer_cast<ExternalKeyboardViewProps const>(props);
  [super updateProps:props oldProps:oldProps];

  [self updateKeyPressProps:RNCEKV::KeyPressProps::from(oldViewProps)
                      newProps:RNCEKV::KeyPressProps::from(newViewProps)];
  
  [self updateContextMenuProps:RNCEKV::ContextMenuProps::from(oldViewProps)
                      newProps:RNCEKV::ContextMenuProps::from(newViewProps)];
  
  [self updateFocusProps:RNCEKV::FocusProps::from(oldViewProps)
                  newProps:RNCEKV::FocusProps::from(newViewProps)];
  
  [self updateGroupIdentifierProps:RNCEKV::GroupIdentifierProps::from(oldViewProps)
                          newProps:RNCEKV::GroupIdentifierProps::from(newViewProps)];

  [self updateHaloProps:RNCEKV::HaloProps::from(oldViewProps)
               newProps:RNCEKV::HaloProps::from(newViewProps)];
  [self updateFocusOrderProps:RNCEKV::OrderProps::from(oldViewProps)
                     newProps:RNCEKV::OrderProps::from(newViewProps)];
  [self updateFocusRequestProps:RNCEKV::AutoFocusProps::from(oldViewProps)
                     newProps:RNCEKV::AutoFocusProps::from(newViewProps)];

  if (oldViewProps.group != newViewProps.group) {
    [self setIsGroup:newViewProps.group];
  }
}


Class<RCTComponentViewProtocol> ExternalKeyboardViewCls(void) {
  return RNCEKVExternalKeyboardView.class;
}

#endif

#ifdef RCT_NEW_ARCH_ENABLED
- (void)onContextMenuPressHandler {
  [RNCEKVFabricEventHelper onContextMenuPressEventEmmiter:_eventEmitter];
}

- (void)onBubbledContextMenuPressHandler {
  [RNCEKVFabricEventHelper onBubbledContextMenuPressEventEmmiter:_eventEmitter];
}

- (void)onFocusChangeHandler:(BOOL)isFocused {
  [super onFocusChangeHandler: isFocused];
  [RNCEKVFabricEventHelper onFocusChangeEventEmmiter:isFocused
                                         withEmitter:_eventEmitter];
}

- (void)onKeyDownPressHandler:(NSDictionary *)eventInfo {
  [RNCEKVFabricEventHelper onKeyDownPressEventEmmiter:eventInfo
                                          withEmitter:_eventEmitter];
}

- (void)onKeyUpPressHandler:(NSDictionary *)eventInfo {
  [RNCEKVFabricEventHelper onKeyUpPressEventEmmiter:eventInfo
                                        withEmitter:_eventEmitter];
}

#else

- (void)onContextMenuPressHandler {
  if (self.onContextMenuPress) {
    self.onContextMenuPress(@{});
  }
}

- (void)onBubbledContextMenuPressHandler {
  if (self.onBubbledContextMenuPress) {
    self.onBubbledContextMenuPress(@{});
  }
}
//
- (void)onFocusChangeHandler:(BOOL)isFocused {
  [super onFocusChangeHandler: isFocused];
  if (self.onFocusChange) {
    self.onFocusChange(@{@"isFocused" : @(isFocused)});
  }
}

- (void)onKeyDownPressHandler:(NSDictionary *)eventInfo {
  if (self.onKeyDownPress) {
    self.onKeyDownPress(eventInfo);
  }
}

- (void)onKeyUpPressHandler:(NSDictionary *)eventInfo {
  if (self.onKeyUpPress) {
    self.onKeyUpPress(eventInfo);
  }
}

#endif

@end
