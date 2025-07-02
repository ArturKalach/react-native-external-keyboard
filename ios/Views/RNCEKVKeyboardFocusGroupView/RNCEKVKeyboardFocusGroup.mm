//
//  TintColorView.m
//  Pods
//
//  Created by Artur Kalach on 24/12/2024.
//

#import "RNCEKVKeyboardFocusGroup.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import "RNCEKVOrderLinking.h"
#import "RNCEKVRelashioship.h"
#import "RNCEKVExternalKeyboardView.h"

#ifdef RCT_NEW_ARCH_ENABLED
#include <string>
#import <react/renderer/components/RNExternalKeyboardViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/EventEmitters.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/Props.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import "RNCEKVFabricEventHelper.h"
#import <React/RCTConversions.h>

using namespace facebook::react;

@interface RNCEKVKeyboardFocusGroup () <RCTKeyboardFocusGroupViewProtocol>

@end

#endif

@implementation RNCEKVKeyboardFocusGroup {
  UIView* _entry;
  UIView* _exit;
  UIView* _lock;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        _isGroupFocused = false;
        _entry = nil;
        _exit = nil;
#ifdef RCT_NEW_ARCH_ENABLED
        static const auto defaultProps = std::make_shared<const KeyboardFocusGroupProps>();
        _props = defaultProps;
#endif
    }
    
    return self;
}


- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
    
    [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
    NSString* nextFocusGroup = context.nextFocusedView.focusGroupIdentifier;
    BOOL isFocused = [nextFocusGroup isEqual: _customGroupId];
    if(_isGroupFocused != isFocused){
        _isGroupFocused = isFocused;
        [self onFocusChangeHandler: isFocused];
    }
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    if (@available(iOS 14.0, *)) {
        if(_customGroupId) {
            self.focusGroupIdentifier = _customGroupId;
        }
    }
}

#ifdef RCT_NEW_ARCH_ENABLED

- (void)onFocusChangeHandler:(BOOL) isFocused {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<KeyboardFocusGroupEventEmitter const>(_eventEmitter);
        facebook::react::KeyboardFocusGroupEventEmitter::OnGroupFocusChange data = {
            .isFocused = isFocused,
        };
        viewEventEmitter->onGroupFocusChange(data);
    };
}

#else
- (void)onFocusChangeHandler:(BOOL) isFocused {
    if(self.onGroupFocusChange) {
        self.onGroupFocusChange(@{ @"isFocused": @(isFocused) });
    }
}
#endif


#pragma mark - Get Order Focus List
- (NSArray<UIView *> *)getOrder {
  RNCEKVRelashioship* orderRelationship = [[RNCEKVOrderLinking sharedInstance] getInfo:_orderGroup];
  return [orderRelationship getArray];
}


#pragma mark - Focus Find Index
- (int)findOrderIndex:(NSArray *)order element:(UIView*)el  {
  int resultIndex = -1;

  for (int i = 0; i < order.count; i++) {
    UIView *element = order[i];
      if (element.subviews[0] == el) { //ToDo focus element
        resultIndex = i;
        break;
      }
  }
  
  return resultIndex;
}


#pragma mark - Next Focus Handling
- (void)handleNextFocus:(UIView *)current currentIndex:(NSInteger)currentIndex {
  NSArray<UIView *> * order = [self getOrder];
  
  BOOL isEntry = _entry == current;
  if (isEntry) {
    UIView* firstElement = order[0];
    if ([firstElement isKindOfClass:[RNCEKVExternalKeyboardView class]]) {
      [(RNCEKVExternalKeyboardView*)firstElement focus];
    }
  }
  
  BOOL isLast = currentIndex == order.count - 1 && _exit;
  if (isLast) {
    [self updateFocus: _exit];
  }
  
  BOOL inOrderRange = currentIndex >= 0 && currentIndex < order.count - 1;
  if (inOrderRange) {
    UIView* nextElement = order[currentIndex + 1];
    if ([nextElement isKindOfClass:[RNCEKVExternalKeyboardView class]]) {
      [(RNCEKVExternalKeyboardView*)nextElement focus];
    }
  }
}

#pragma mark - Prev Focus Handling
- (void)handlePrevFocus:(UIView *)current currentIndex:(NSInteger)currentIndex {
  NSArray<UIView *> * order = [self getOrder];
  
  BOOL isExit = _exit == current;
  if (isExit) {
    UIView* lastElement = order[order.count - 1];
    if ([lastElement isKindOfClass:[RNCEKVExternalKeyboardView class]]) {
      [(RNCEKVExternalKeyboardView*)lastElement focus];
    }
  }
  
  BOOL isFirst = currentIndex == 0 && _entry;
  if (isFirst) {
    [self updateFocus: _entry];
  }
  
  BOOL inRange = currentIndex > 0 && currentIndex <= order.count - 1;
  if (inRange) {
    UIView* prevElement = order[currentIndex - 1];
    if ([prevElement isKindOfClass:[RNCEKVExternalKeyboardView class]]) {
      [(RNCEKVExternalKeyboardView*)prevElement focus];
    }
  }
}

#pragma mark - Focus Order Handler
- (BOOL)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
    return YES;
    UIView *next = (UIView *)context.nextFocusedItem;
    UIView *current = (UIView *)context.previouslyFocusedItem;
    UIFocusHeading movementHint = context.focusHeading;

//  UIView* rnkv = current.superview; //ToDo Create a map for RNKV <-> Target relations
//  if ([rnkv isKindOfClass:[RNCEKVExternalKeyboardView class]]) {
//      NSUInteger rawFocusLockValue = [((RNCEKVExternalKeyboardView *)rnkv).lockFocus unsignedIntegerValue];
//
//      BOOL isDirectionLock = (rawFocusLockValue & movementHint) != 0;
//      if (isDirectionLock) {
//          return NO;
//      }
//  }
  
  if(_orderGroup) {
    RNCEKVRelashioship* orderRelationship = [[RNCEKVOrderLinking sharedInstance] getInfo:_orderGroup];
    NSArray *order = [orderRelationship getArray];
    if(order.count == 0) {
      return YES;
    }
    
    int currentIndex = [self findOrderIndex:order element:current];
    int nextIndex = [self findOrderIndex:order element:next];

    BOOL isEntryElement = _entry == nil && currentIndex == -1 && movementHint == UIFocusHeadingNext;
    if(isEntryElement) {
      _entry = current;
    }
    
    BOOL isExit = _exit == nil && nextIndex == -1 && movementHint == UIFocusHeadingNext;
    if(isExit) {
      _exit = next;
    }
    
    if(context.focusHeading == UIFocusHeadingNext) {
      [self handleNextFocus:current currentIndex: currentIndex];
      return YES;
    }
    
    
    if(context.focusHeading == UIFocusHeadingPrevious) {
      [self handlePrevFocus:current currentIndex: currentIndex];
      return YES;
    }
    
    //ToDo add sides focus handlers
  }
  
  return YES;
}

- (void)updateFocus:(UIView *)focusingView {
  UIViewController *controller = self.reactViewController;

  if (controller != nil) {
    controller.customFocusView = focusingView;
    dispatch_async(dispatch_get_main_queue(), ^{
      [controller setNeedsFocusUpdate];
      [controller updateFocusIfNeeded];
    });
  }
}




#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<KeyboardFocusGroupComponentDescriptor>();
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _customGroupId = nil;
    self.tintColor = nil;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<KeyboardFocusGroupProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<KeyboardFocusGroupProps const>(props);
    [super updateProps
     :props oldProps:oldProps];
  
  
    UIColor* newColor = RCTUIColorFromSharedColor(newViewProps.tintColor);
    BOOL isDifferentColor = ![newColor isEqual: self.tintColor];
    BOOL renewColor = newColor != nil && self.tintColor == nil;
    BOOL isColorChanged = oldViewProps.tintColor != newViewProps.tintColor;
    if(isColorChanged || renewColor || isDifferentColor) {
        self.tintColor = newColor;
    }
    
    if(oldViewProps.groupIdentifier != newViewProps.groupIdentifier || !self.customGroupId) {
      if(newViewProps.groupIdentifier.empty()) {
        [self setCustomGroupId:nil];
      } else {
        NSString *newGroupId = [NSString stringWithUTF8String:newViewProps.groupIdentifier.c_str()];
        [self setCustomGroupId:newGroupId];
      }
    }
  
  if(oldViewProps.orderGroup != newViewProps.orderGroup) {
    _orderGroup = [NSString stringWithUTF8String:newViewProps.orderGroup.c_str()];
  }

}

Class<RCTComponentViewProtocol> KeyboardFocusGroupCls(void)
{
    return RNCEKVKeyboardFocusGroup.class;
}


#endif



@end




