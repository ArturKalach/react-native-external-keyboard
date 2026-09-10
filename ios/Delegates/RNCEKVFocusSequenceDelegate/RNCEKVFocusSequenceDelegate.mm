//
//  RNCEKVFocusSequenceDelegate.mm
//  react-native-external-keyboard
//

#import <Foundation/Foundation.h>
#import "RNCEKVFocusSequenceDelegate.h"
#import "RNCEKVOrderLinking.h"
#import "RNCEKVOrderRelationship.h"
#import "RNCEKVKeyboardFocusableProtocol.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import <React/UIView+React.h>

static NSNumber *const FOCUS_DEFAULT = nil;
static NSNumber *const FOCUS_HANDLED = @0;

@implementation RNCEKVFocusSequenceDelegate {
  BOOL _isLinked;
  UIView<RNCEKVFocusOrderProtocol> *_delegate;
}

- (instancetype)initWithView:(UIView<RNCEKVFocusOrderProtocol> *)delegate {
  self = [super init];
  if (self) {
    _delegate = delegate;
  }
  return self;
}

- (void)link {
  if (_delegate.orderPosition != nil && _delegate.orderGroup != nil && !_isLinked) {
    [[RNCEKVOrderLinking sharedInstance] add:_delegate.orderPosition withOrderKey:_delegate.orderGroup withObject:_delegate];
    _isLinked = YES;
  }
}

- (void)unlink {
  if (_delegate.orderPosition != nil && _delegate.orderGroup != nil && _isLinked) {
    [[RNCEKVOrderLinking sharedInstance] remove:_delegate.orderPosition withOrderKey:_delegate.orderGroup];
  }
  _isLinked = NO;
}

- (void)updatePosition:(NSNumber *)position {
  if (position == nil || _delegate.orderPosition == position || (_delegate.orderPosition != nil && [_delegate.orderPosition isEqualToNumber:position])) {
    return;
  }
  if (_delegate.orderGroup != nil && _delegate.superview != nil && _isLinked) {
    [[RNCEKVOrderLinking sharedInstance] update:position lastPosition:_delegate.orderPosition withOrderKey:_delegate.orderGroup withView:_delegate];
  }
}

- (void)updateOrderGroup:(NSString *)orderGroup {
  if (_delegate.orderPosition != nil && _delegate.superview != nil) {
    [[RNCEKVOrderLinking sharedInstance] updateOrderKey:_delegate.orderGroup next:orderGroup position:_delegate.orderPosition withView:_delegate];
  }
}

#pragma mark - Focus helpers

- (void)keyboardedViewFocus:(UIView *)view {
  if ([view conformsToProtocol:@protocol(RNCEKVKeyboardFocusableProtocol)]) {
    [(UIView<RNCEKVKeyboardFocusableProtocol> *)view focus];
  }
}

- (void)defaultViewFocus:(UIView *)view {
  UIViewController *controller = _delegate.reactViewController;
  if (controller != nil) {
    [controller rncekvFocusView:view];
  }
}

#pragma mark - Sequential navigation

- (BOOL)handleNextFocus:(UIView *)current
           currentIndex:(NSInteger)currentIndex
      orderRelationship:(RNCEKVOrderRelationship *)orderRelationship {
  UIView *entry = orderRelationship.entry;
  UIView *exit = orderRelationship.exit;

  if (entry == current) {
    [self keyboardedViewFocus:[orderRelationship getItem:0]];
    return NO;
  }

  if (currentIndex == orderRelationship.count - 1 && exit) {
    [self defaultViewFocus:exit];
    return YES;
  }

  if (currentIndex >= 0 && currentIndex < orderRelationship.count - 1) {
    [self keyboardedViewFocus:[orderRelationship getItem:currentIndex + 1]];
    return YES;
  }

  return NO;
}

- (BOOL)handlePrevFocus:(UIView *)current
           currentIndex:(NSInteger)currentIndex
      orderRelationship:(RNCEKVOrderRelationship *)orderRelationship {
  UIView *exit = orderRelationship.exit;
  UIView *entry = orderRelationship.entry;
  int orderCount = [orderRelationship count];

  if (exit == current) {
    [self keyboardedViewFocus:[orderRelationship getItem:orderCount - 1]];
    return YES;
  }

  if (currentIndex == 0 && entry) {
    [self defaultViewFocus:entry];
    return YES;
  }

  if (currentIndex > 0 && currentIndex <= orderCount - 1) {
    [self keyboardedViewFocus:[orderRelationship getItem:currentIndex - 1]];
    return YES;
  }

  return NO;
}

#pragma mark - shouldUpdateFocusInContext

- (NSNumber *)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
  UIFocusHeading movementHint = context.focusHeading;
  UIView *next = (UIView *)context.nextFocusedItem;
  UIView *current = (UIView *)context.previouslyFocusedItem;

  if (_delegate.orderGroup && _delegate.orderPosition != nil) {
    RNCEKVOrderRelationship *orderRelationship = [[RNCEKVOrderLinking sharedInstance] getInfo:_delegate.orderGroup];
    if ([orderRelationship getArray].count == 0) {
      return FOCUS_DEFAULT;
    }

    int currentIndex = [orderRelationship getItemIndex:current];
    int nextIndex = [orderRelationship getItemIndex:next];

    if (orderRelationship.entry == nil && currentIndex == -1 && movementHint == UIFocusHeadingNext) {
      orderRelationship.entry = current;
    }

    if (orderRelationship.exit == nil && nextIndex == -1 && movementHint == UIFocusHeadingNext) {
      orderRelationship.exit = next;
    }

    if (movementHint == UIFocusHeadingNext) {
      BOOL handled = [self handleNextFocus:current currentIndex:currentIndex orderRelationship:orderRelationship];
      return handled ? FOCUS_HANDLED : FOCUS_DEFAULT;
    }

    if (movementHint == UIFocusHeadingPrevious) {
      BOOL handled = [self handlePrevFocus:current currentIndex:currentIndex orderRelationship:orderRelationship];
      return handled ? FOCUS_HANDLED : FOCUS_DEFAULT;
    }
  }

  return FOCUS_DEFAULT;
}

@end
