//
//  RNCEKVFocusOrderDelegate.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 25/06/2025.
//

#import <Foundation/Foundation.h>


#import "RNCEKVFocusOrderDelegate.h"
#import "RNCEKVFocusOrderProtocol.h"
#import "RNCEKVFocusEffectUtility.h"
#import "RNCEKVOrderLinking.h"
#import "RNCEKVExternalKeyboardView.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import "RNCEKVOrderSubscriber.h"
#import "RNCEKVFocusLinkObserver.h"
#import "RNCEKVFocusGuideHelper.h"
#import "RNCEKVFocusGuideDelegate.h"
#import "UIView+React.h"

static NSNumber *const FOCUS_DEFAULT = nil;
static NSNumber *const FOCUS_LOCK = @0;
static NSNumber *const FOCUS_UPDATE = @1;

@implementation RNCEKVFocusOrderDelegate{
  BOOL _isLinked;
  UIView<RNCEKVFocusOrderProtocol>* _delegate;
  RNCEKVFocusGuideDelegate *_focusGuideDelegate;
}

- (instancetype _Nonnull )initWithView:(UIView<RNCEKVFocusOrderProtocol> *_Nonnull)delegate{
  self = [super init];
  if (self) {
    _delegate = delegate;
    _focusGuideDelegate = [[RNCEKVFocusGuideDelegate alloc] initWithView:delegate];
    _subscribers = [NSMutableDictionary dictionary];
  }
  return self;
}

- (void)updatePosition:(NSNumber*) position {
  if (position == nil || _delegate.orderPosition == position || (_delegate.orderPosition != nil && [_delegate.orderPosition isEqualToNumber:position])) {
    return;
  }

  if (_delegate.orderGroup != nil && _delegate.superview != nil && _isLinked) {
    [[RNCEKVOrderLinking sharedInstance] update: position lastPosition: _delegate.orderPosition withOrderKey: _delegate.orderGroup withView: _delegate];
  }
}

- (void)updateOrderGroup:(NSString *)orderGroup {
  if(_delegate.orderPosition != nil  && _delegate.superview != nil) {
    [[RNCEKVOrderLinking sharedInstance] updateOrderKey: _delegate.orderGroup next:orderGroup position: _delegate.orderPosition withView: _delegate];
  }
}

- (void)link {
  if(_delegate.orderPosition != nil && _delegate.orderGroup != nil && !_isLinked) {
    [[RNCEKVOrderLinking sharedInstance] add: _delegate.orderPosition withOrderKey: _delegate.orderGroup withObject: _delegate];
    _isLinked = YES;
  }
  if(_delegate.orderId != nil) {
    [[RNCEKVOrderLinking sharedInstance] storeOrderId: _delegate.orderId withView: _delegate];
    [self linkId];
  }
}

- (void)unlink {
  if(_delegate.orderPosition != nil && _delegate.orderGroup != nil && _isLinked) {
    [[RNCEKVOrderLinking sharedInstance] remove: _delegate.orderPosition withOrderKey: _delegate.orderGroup];
  }
  if(_delegate.orderId != nil) {
    [[RNCEKVOrderLinking sharedInstance] cleanOrderId: _delegate.orderId];
    [self clear];
  }
  _isLinked = NO;
}

- (void)subscribeToDirection:(RNCEKVFocusGuideDirection)direction
                      linkId:(NSString *)linkId {
  if (!linkId) {
    return;
  }

  if(_subscribers[@(direction)]) {
    [self clearDirection: direction];
  }

  RNCEKVFocusGuideDirection capturedDirection = direction;

  LinkUpdatedCallback onLinkUpdated = ^(UIView *link) {
    [self->_focusGuideDelegate setGuideFor:capturedDirection withView: link];
  };

  LinkRemovedCallback onLinkRemoved = ^{
    [self->_focusGuideDelegate removeGuideFor: capturedDirection];
  };

  RNCEKVOrderSubscriber* subscriber = [[RNCEKVFocusLinkObserver sharedManager] subscribe:linkId
                                                                           onLinkUpdated:onLinkUpdated
                                                                           onLinkRemoved:onLinkRemoved];
  self.subscribers[@(direction)] = subscriber;
}

- (void)clearDirection:(RNCEKVFocusGuideDirection)direction {
  if (!self.subscribers[@(direction)]) {
    return;
  }

  [[RNCEKVFocusLinkObserver sharedManager] unsubscribe:self.subscribers[@(direction)]];
  self.subscribers[@(direction)] = nil;
  [_focusGuideDelegate removeGuideFor: direction];
}

- (void)refreshDirection:(RNCEKVFocusGuideDirection)direction
                  nextId:(NSString *)nextId {
  [self clearDirection:direction];
  [self subscribeToDirection:direction linkId:nextId];
}

- (void)keyboardedViewFocus:(UIView *)view {
  if ([view respondsToSelector:@selector(focus)]) {
    [(id)view focus];
  }
}

- (void)defaultViewFocus:(UIView *)view {
  UIViewController *controller = _delegate.reactViewController;
  if (controller != nil) {
    [controller rncekvFocusView:view];
  }
}


#pragma mark - Next Focus Handling
- (void)handleNextFocus:(UIView *)current
           currentIndex:(NSInteger)currentIndex
      orderRelationship:(RNCEKVOrderRelationship *)orderRelationship {
  UIView* entry = orderRelationship.entry;
  UIView* exit = orderRelationship.exit;

  if (entry == current) {
    [self keyboardedViewFocus: [orderRelationship getItem: 0]];
  }

  if (currentIndex == orderRelationship.count - 1 && exit) {
    [self defaultViewFocus: exit];
  }

  if (currentIndex >= 0 && currentIndex < orderRelationship.count - 1) {
    [self keyboardedViewFocus: [orderRelationship getItem: currentIndex + 1]];
  }
}


#pragma mark - Prev Focus Handling
- (void)handlePrevFocus:(UIView *)current
           currentIndex:(NSInteger)currentIndex
      orderRelationship:(RNCEKVOrderRelationship *)orderRelationship {
  UIView* exit = orderRelationship.exit;
  UIView* entry = orderRelationship.entry;
  int orderCount = [orderRelationship count];

  if (exit == current) {
    [self keyboardedViewFocus: [orderRelationship getItem: orderCount - 1]];
  }

  if (currentIndex == 0 && entry) {
    [self defaultViewFocus: entry];
  }

  if (currentIndex > 0 && currentIndex <= orderCount - 1) {
    [self keyboardedViewFocus: [orderRelationship getItem: currentIndex - 1]];
  }
}

#pragma mark - Focus Order Handler
- (NSNumber*)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
  UIFocusHeading movementHint = context.focusHeading;
  UIView *next = (UIView *)context.nextFocusedItem;
  UIView *current = (UIView *)context.previouslyFocusedItem;
  UIView* targetView = [_delegate getFocusTargetView];

  if (current == targetView) {
    NSString *orderId = nil;
    if (movementHint == UIFocusHeadingLast) orderId = _delegate.orderLast;
    else if (movementHint == UIFocusHeadingFirst) orderId = _delegate.orderFirst;
    else if (movementHint == UIFocusHeadingNext) orderId = _delegate.orderForward;
    else if (movementHint == UIFocusHeadingPrevious) orderId = _delegate.orderBackward;

    if (orderId) {
      UIView *nextView = [[RNCEKVOrderLinking sharedInstance] getOrderView:orderId];
      [self keyboardedViewFocus:nextView];
      return FOCUS_LOCK;
    }

    NSUInteger rawFocusLockValue = [_delegate.lockFocus unsignedIntegerValue];
    if ((rawFocusLockValue & movementHint) != 0) {
      return FOCUS_LOCK;
    }
  }

  if(_delegate.orderGroup && _delegate.orderPosition != nil) {
    RNCEKVOrderRelationship* orderRelationship = [[RNCEKVOrderLinking sharedInstance] getInfo: _delegate.orderGroup];
    if([orderRelationship getArray].count == 0) {
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

- (void)linkId {
  RNCEKVFocusLinkObserver *focusLinkObserver = [RNCEKVFocusLinkObserver sharedManager];

  NSString* orderId = _delegate.orderId;
  UIView* view = [_delegate getFocusTargetView];

  if(orderId != nil) {
    [focusLinkObserver emitWithId:orderId link:view];
  }

  [self subscribeToDirection:RNCEKVFocusGuideDirectionLeft
                      linkId:_delegate.orderLeft];

  [self subscribeToDirection:RNCEKVFocusGuideDirectionRight
                      linkId:_delegate.orderRight
  ];

  [self subscribeToDirection:RNCEKVFocusGuideDirectionUp
                      linkId:_delegate.orderUp
  ];

  [self subscribeToDirection:RNCEKVFocusGuideDirectionDown
                      linkId:_delegate.orderDown
  ];
}

- (void)refreshId: (NSString*)prev next:(NSString*)next {
  RNCEKVFocusLinkObserver *focusLinkObserver = [RNCEKVFocusLinkObserver sharedManager];
  UIView* view = [_delegate getFocusTargetView];

  if(prev != nil) {
    [focusLinkObserver emitRemoveWithId: prev];
    [[RNCEKVOrderLinking sharedInstance] cleanOrderId: prev];
  }

  if(next != nil && view != nil) {
    [[RNCEKVOrderLinking sharedInstance] storeOrderId: next withView:_delegate];
    [focusLinkObserver emitWithId:next link:view];
  }
};

- (void)setIsFocused:(BOOL)value {
  return [_focusGuideDelegate setIsFocused: value];
}

- (void)refreshLeft:(NSString*)next {
  [self refreshDirection:RNCEKVFocusGuideDirectionLeft nextId:next];
}

- (void)refreshRight:(NSString*)next {
  [self refreshDirection:RNCEKVFocusGuideDirectionRight nextId:next];
}

- (void)refreshUp:(NSString*)next {
  [self refreshDirection:RNCEKVFocusGuideDirectionUp nextId:next];
}

- (void)refreshDown:(NSString*)next {
  [self refreshDirection:RNCEKVFocusGuideDirectionDown nextId:next];
}

- (void)clear {
  [self clearDirection:RNCEKVFocusGuideDirectionLeft];
  [self clearDirection:RNCEKVFocusGuideDirectionRight];
  [self clearDirection:RNCEKVFocusGuideDirectionUp];
  [self clearDirection:RNCEKVFocusGuideDirectionDown];

  [self refreshId: _delegate.orderId next:nil];
}

@end
