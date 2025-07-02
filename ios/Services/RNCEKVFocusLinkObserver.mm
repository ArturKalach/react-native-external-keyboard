//
//  RNCEKVFocusLinkObserver.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 26/06/2025.
//

#import <Foundation/Foundation.h>
#import "RNCEKVFocusLinkObserver.h"
#import "RNCEKVOrderSubscriber.h"

@implementation RNCEKVFocusLinkObserver {
  NSMutableDictionary<NSString *, UIView *> *_links; // To store the links
  NSMutableDictionary<NSString *, NSMutableArray<RNCEKVOrderSubscriber *> *> *_subscribers; // To store the subscribers
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _links = [NSMutableDictionary dictionary];
    _subscribers = [NSMutableDictionary dictionary];
  }
  return self;
}

- (void)emitWithId:(NSString *)identifier link:(UIView *)link {
  if (!identifier || !link) {
    return;
  }
  
  [_links setObject:link forKey:identifier];
  [self emitLinkUpdatedForId:identifier link:link];
}

- (void)emitRemoveWithId:(NSString *)identifier {
  if ([_links objectForKey:identifier]) {
    [_links removeObjectForKey:identifier];
    [self emitLinkRemovedForId:identifier];
  }
}

- (void)subscribeWithId:(NSString *)identifier
          onLinkUpdated:(LinkUpdatedCallback)onLinkUpdated
          onLinkRemoved:(LinkRemovedCallback)onLinkRemoved {
  if (!identifier || (!onLinkUpdated && !onLinkRemoved)) {
    return;
  }
  
  if (!_subscribers[identifier]) {
    _subscribers[identifier] = [NSMutableArray array];
  }
  
  RNCEKVOrderSubscriber *subscriber = [[RNCEKVOrderSubscriber alloc] initWithUpdatedCallback:onLinkUpdated
                                                                             removedCallback:onLinkRemoved];
  [_subscribers[identifier] addObject:subscriber];
  
  if (onLinkUpdated && _links[identifier]) {
    onLinkUpdated(_links[identifier]);
  }
}

- (void)unsubscribeWithId:(NSString *)identifier
            onLinkUpdated:(LinkUpdatedCallback)onLinkUpdated
            onLinkRemoved:(LinkRemovedCallback)onLinkRemoved {
  if (!identifier || (!onLinkUpdated && !onLinkRemoved)) {
    return;
  }
  
  NSMutableArray<RNCEKVOrderSubscriber *> *subscriberList = _subscribers[identifier];
  if (subscriberList) {
    [subscriberList filterUsingPredicate:[NSPredicate predicateWithBlock:^BOOL(RNCEKVOrderSubscriber *subscriber, NSDictionary *bindings) {
      return !(subscriber.onLinkUpdated == onLinkUpdated && subscriber.onLinkRemoved == onLinkRemoved);
    }]];
    
    if (subscriberList.count == 0) {
      [_subscribers removeObjectForKey:identifier];
    }
  }
}

#pragma mark - Private

- (void)emitLinkUpdatedForId:(NSString *)identifier link:(UIView *)link {
  NSArray<RNCEKVOrderSubscriber *> *subscriberList = [_subscribers[identifier] copy];
  for (RNCEKVOrderSubscriber *subscriber in subscriberList) {
    if (subscriber.onLinkUpdated) {
      subscriber.onLinkUpdated(link);
    }
  }
}

- (void)emitLinkRemovedForId:(NSString *)identifier {
  NSArray<RNCEKVOrderSubscriber *> *subscriberList = [_subscribers[identifier] copy];
  for (RNCEKVOrderSubscriber *subscriber in subscriberList) {
    if (subscriber.onLinkRemoved) {
      subscriber.onLinkRemoved();
    }
  }
}

@end
