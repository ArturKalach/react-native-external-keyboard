//
//  RNCEKVOrderLinking.m
//  A11yOrder
//
//  Created by Artur Kalach on 13/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNCEKVOrderLinking.h"
#import "RNCEKVOrderRelationship.h"

@implementation RNCEKVOrderLinking {
  NSMutableDictionary<NSString *, RNCEKVOrderRelationship *> *_relationships;
  NSMapTable<NSString *, UIView *> *_weakMap;
}

+ (instancetype)sharedInstance {
  static RNCEKVOrderLinking *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[self alloc] init];
  });
  return sharedInstance;
}

- (id)init {
  if (self = [super init]) {
    _relationships = [NSMutableDictionary dictionary];
    _weakMap = [NSMapTable strongToWeakObjectsMapTable];
  }
  return self;
}

- (RNCEKVOrderRelationship *)getInfo:(NSString *)orderGroup {
  return _relationships[orderGroup];
}

- (RNCEKVOrderRelationship *)relationshipForKey:(NSString *)orderKey {
  RNCEKVOrderRelationship *relationship = _relationships[orderKey];
  if (relationship == nil) {
    relationship = [[RNCEKVOrderRelationship alloc] init];
    _relationships[orderKey] = relationship;
  }
  return relationship;
}

- (void)removeRelationshipIfEmpty:(RNCEKVOrderRelationship *)relationship forKey:(NSString *)orderKey {
  if ([relationship isEmpty]) {
    [relationship clear];
    [_relationships removeObjectForKey:orderKey];
  }
}

- (void)add:(NSNumber *)position withOrderKey:(NSString *)orderKey withObject:(NSObject *)obj {
  [[self relationshipForKey:orderKey] add:position withObject:obj];
}

- (void)remove:(NSNumber *)position withOrderKey:(NSString *)orderKey {
  RNCEKVOrderRelationship *relationship = _relationships[orderKey];
  if (relationship == nil) return;
  [relationship remove:position];
  [self removeRelationshipIfEmpty:relationship forKey:orderKey];
}

- (void)update:(NSNumber *)position lastPosition:(NSNumber *)lastPosition withOrderKey:(NSString *)orderKey withView:(UIView *)view {
  [_relationships[orderKey] update:lastPosition withPosition:position withObject:view];
}

- (void)updateOrderKey:(NSString *)prev next:(NSString *)next position:(NSNumber *)position withView:(UIView *)view {
  if (prev != nil) {
    RNCEKVOrderRelationship *relationship = _relationships[prev];
    if (relationship != nil) {
      [relationship remove:position];
      [self removeRelationshipIfEmpty:relationship forKey:prev];
    }
  }

  if (next != nil) {
    [[self relationshipForKey:next] add:position withObject:view];
  }
}

- (void)storeOrderId:(NSString *)orderId withView:(UIView *)view {
  [_weakMap setObject:view forKey:orderId];
}

- (UIView *)getOrderView:(NSString *)orderId {
  return [_weakMap objectForKey:orderId];
}

- (void)cleanOrderId:(NSString *)orderId {
  [_weakMap removeObjectForKey:orderId];
}



@end
