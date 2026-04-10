//
//  RNCEKVFocusLinkDelegate.mm
//  react-native-external-keyboard
//

#import <Foundation/Foundation.h>
#import "RNCEKVFocusLinkDelegate.h"
#import "RNCEKVFocusGuideHelper.h"
#import "RNCEKVFocusLinkObserver.h"
#import "RNCEKVOrderSubscriber.h"
#import "RNCEKVOrderLinking.h"

static NSNumber *const FOCUS_DEFAULT = nil;
static NSNumber *const FOCUS_LOCK = @0;

@implementation RNCEKVFocusLinkDelegate {
  BOOL _isFocused;
  UIView<RNCEKVFocusOrderProtocol> *_delegate;
  NSMutableDictionary<NSNumber *, UIFocusGuide *> *_sides;
  NSMutableDictionary<NSNumber *, RNCEKVOrderSubscriber *> *_subscribers;
}

- (instancetype)initWithView:(UIView<RNCEKVFocusOrderProtocol> *)delegate {
  self = [super init];
  if (self) {
    _delegate = delegate;
    _isFocused = NO;
    _sides = [NSMutableDictionary dictionary];
    _subscribers = [NSMutableDictionary dictionary];
  }
  return self;
}

- (void)link {
  if (_delegate.orderId != nil) {
    [[RNCEKVOrderLinking sharedInstance] storeOrderId:_delegate.orderId withView:_delegate];
    [self linkId];
  }
}

- (void)unlink {
  if (_delegate.orderId != nil) {
    [[RNCEKVOrderLinking sharedInstance] cleanOrderId:_delegate.orderId];
    [self clear];
  }
}

#pragma mark - Guide management

- (void)setGuideFor:(RNCEKVFocusGuideDirection)direction withView:(UIView *)view {
  if (!view) return;
  [self removeGuideFor:direction];
  _sides[@(direction)] = [RNCEKVFocusGuideHelper setGuideForDirection:direction
                                                               inView:_delegate
                                                           focusView:view
                                                             enabled:_isFocused];
}

- (void)removeGuideFor:(RNCEKVFocusGuideDirection)direction {
  if (_sides[@(direction)]) {
    [_delegate removeLayoutGuide:_sides[@(direction)]];
    _sides[@(direction)] = nil;
  }
}

- (void)setIsFocused:(BOOL)value {
  _isFocused = value;
  for (NSNumber *key in _sides) {
    _sides[key].enabled = value;
  }
}

#pragma mark - Subscriptions

- (void)subscribeToDirection:(RNCEKVFocusGuideDirection)direction linkId:(NSString *)linkId {
  if (!linkId) return;

  if (_subscribers[@(direction)]) {
    [self clearDirection:direction];
  }

  RNCEKVFocusGuideDirection capturedDirection = direction;

  LinkUpdatedCallback onLinkUpdated = ^(UIView *link) {
    [self setGuideFor:capturedDirection withView:link];
  };

  LinkRemovedCallback onLinkRemoved = ^{
    [self removeGuideFor:capturedDirection];
  };

  RNCEKVOrderSubscriber *subscriber = [[RNCEKVFocusLinkObserver sharedManager] subscribe:linkId
                                                                           onLinkUpdated:onLinkUpdated
                                                                           onLinkRemoved:onLinkRemoved];
  _subscribers[@(direction)] = subscriber;
}

- (void)clearDirection:(RNCEKVFocusGuideDirection)direction {
  if (!_subscribers[@(direction)]) return;
  [[RNCEKVFocusLinkObserver sharedManager] unsubscribe:_subscribers[@(direction)]];
  _subscribers[@(direction)] = nil;
  [self removeGuideFor:direction];
}

- (void)refreshDirection:(RNCEKVFocusGuideDirection)direction nextId:(NSString *)nextId {
  [self clearDirection:direction];
  [self subscribeToDirection:direction linkId:nextId];
}

#pragma mark - Public API

- (void)linkId {
  RNCEKVFocusLinkObserver *focusLinkObserver = [RNCEKVFocusLinkObserver sharedManager];
  NSString *orderId = _delegate.orderId;
  UIView *view = [_delegate getFocusTargetView];

  if (orderId != nil) {
    [focusLinkObserver emitWithId:orderId link:view];
  }

  [self subscribeToDirection:RNCEKVFocusGuideDirectionLeft  linkId:_delegate.orderLeft];
  [self subscribeToDirection:RNCEKVFocusGuideDirectionRight linkId:_delegate.orderRight];
  [self subscribeToDirection:RNCEKVFocusGuideDirectionUp    linkId:_delegate.orderUp];
  [self subscribeToDirection:RNCEKVFocusGuideDirectionDown  linkId:_delegate.orderDown];
}

- (void)refreshId:(NSString *)prev next:(NSString *)next {
  RNCEKVFocusLinkObserver *focusLinkObserver = [RNCEKVFocusLinkObserver sharedManager];
  UIView *view = [_delegate getFocusTargetView];

  if (prev != nil) {
    [focusLinkObserver emitRemoveWithId:prev];
    [[RNCEKVOrderLinking sharedInstance] cleanOrderId:prev];
  }

  if (next != nil && view != nil) {
    [[RNCEKVOrderLinking sharedInstance] storeOrderId:next withView:_delegate];
    [focusLinkObserver emitWithId:next link:view];
  }
}

- (void)refreshLeft:(NSString *)next  { [self refreshDirection:RNCEKVFocusGuideDirectionLeft  nextId:next]; }
- (void)refreshRight:(NSString *)next { [self refreshDirection:RNCEKVFocusGuideDirectionRight nextId:next]; }
- (void)refreshUp:(NSString *)next    { [self refreshDirection:RNCEKVFocusGuideDirectionUp    nextId:next]; }
- (void)refreshDown:(NSString *)next  { [self refreshDirection:RNCEKVFocusGuideDirectionDown  nextId:next]; }

- (void)clear {
  [self clearDirection:RNCEKVFocusGuideDirectionLeft];
  [self clearDirection:RNCEKVFocusGuideDirectionRight];
  [self clearDirection:RNCEKVFocusGuideDirectionUp];
  [self clearDirection:RNCEKVFocusGuideDirectionDown];
  [self refreshId:_delegate.orderId next:nil];
}

- (NSNumber *)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
  UIFocusHeading movementHint = context.focusHeading;
  UIView *current = (UIView *)context.previouslyFocusedItem;
  UIView *targetView = [_delegate getFocusTargetView];

  if (current == targetView) {
    NSUInteger rawFocusLockValue = [_delegate.lockFocus unsignedIntegerValue];
    if ((rawFocusLockValue & movementHint) != 0) {
      return FOCUS_LOCK;
    }
  }

  return FOCUS_DEFAULT;
}

@end
