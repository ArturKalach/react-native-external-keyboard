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
#import "UIView+React.h"

static NSNumber *const FOCUS_DEFAULT = nil;
static NSNumber *const FOCUS_LOCK = @0;
static NSNumber *const FOCUS_UPDATE = @1;

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

- (void)handleNextFocus:(UIView *)current
           currentIndex:(NSInteger)currentIndex
      orderRelationship:(RNCEKVOrderRelationship *)orderRelationship {
  UIView *entry = orderRelationship.entry;
  UIView *exit = orderRelationship.exit;

  if (entry == current) {
    [self keyboardedViewFocus:[orderRelationship getItem:0]];
  }

  if (currentIndex == orderRelationship.count - 1 && exit) {
    [self defaultViewFocus:exit];
  }

  if (currentIndex >= 0 && currentIndex < orderRelationship.count - 1) {
    [self keyboardedViewFocus:[orderRelationship getItem:currentIndex + 1]];
  }
}

- (void)handlePrevFocus:(UIView *)current
           currentIndex:(NSInteger)currentIndex
      orderRelationship:(RNCEKVOrderRelationship *)orderRelationship {
  UIView *exit = orderRelationship.exit;
  UIView *entry = orderRelationship.entry;
  int orderCount = [orderRelationship count];

  if (exit == current) {
    [self keyboardedViewFocus:[orderRelationship getItem:orderCount - 1]];
  }

  if (currentIndex == 0 && entry) {
    [self defaultViewFocus:entry];
  }

  if (currentIndex > 0 && currentIndex <= orderCount - 1) {
    [self keyboardedViewFocus:[orderRelationship getItem:currentIndex - 1]];
  }
}

#pragma mark - shouldUpdateFocusInContext

- (NSNumber *)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
  UIFocusHeading movementHint = context.focusHeading;
  UIView *next = (UIView *)context.nextFocusedItem;
  UIView *current = (UIView *)context.previouslyFocusedItem;
  UIView *targetView = [_delegate getFocusTargetView];

  if (current == targetView) {
    NSString *orderId = nil;
    if (movementHint == UIFocusHeadingLast)          orderId = _delegate.orderLast;
    else if (movementHint == UIFocusHeadingFirst)    orderId = _delegate.orderFirst;
    else if (movementHint == UIFocusHeadingNext)     orderId = _delegate.orderForward;
    else if (movementHint == UIFocusHeadingPrevious) orderId = _delegate.orderBackward;

    if (orderId) {
      UIView *nextView = [[RNCEKVOrderLinking sharedInstance] getOrderView:orderId];
      [self keyboardedViewFocus:nextView];
      return FOCUS_LOCK;
    }
  }

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
      [self handleNextFocus:current currentIndex:currentIndex orderRelationship:orderRelationship];
      return FOCUS_UPDATE;
    }

    if (movementHint == UIFocusHeadingPrevious) {
      [self handlePrevFocus:current currentIndex:currentIndex orderRelationship:orderRelationship];
      return FOCUS_UPDATE;
    }
  }

  return FOCUS_DEFAULT;
}

@end
