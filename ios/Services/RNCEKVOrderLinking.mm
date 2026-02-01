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
  NSMutableDictionary *_relationships;
  NSMapTable *_weakMap;
}

+ (instancetype)sharedInstance {
  static RNCEKVOrderLinking *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[self alloc] init];
  });
  return sharedInstance;
}

- (RNCEKVOrderRelationship*)getInfo:(NSString*)orderGroup {
  RNCEKVOrderRelationship* relationship = [_relationships objectForKey: orderGroup];
  return relationship;
}

- (id)init {
  if (self = [super init]) {
    _relationships = [NSMutableDictionary dictionary];
    _weakMap = [NSMapTable strongToWeakObjectsMapTable];
  }
  
  return self;
}

- (void)add:(NSNumber*)position withOrderKey:(NSString*)orderKey withObject:(NSObject*)obj {
  RNCEKVOrderRelationship* relationship = [_relationships objectForKey: orderKey];
  if(relationship == nil) {
    relationship = [[RNCEKVOrderRelationship alloc] init];
    [_relationships setObject: relationship forKey:orderKey];
  }
  [relationship add:position withObject:obj];
}

-(void)remove:(NSNumber*)position withOrderKey:(NSString*)orderKey {
  RNCEKVOrderRelationship* relationship = [_relationships objectForKey: orderKey];
  if(relationship != nil) {
    [relationship remove:position];
    if([relationship isEmpty]) {
      [relationship clear];
      [_relationships removeObjectForKey: orderKey];
    }
  }
}

- (void)update:(NSNumber*)position lastPosition:(NSNumber*)lastPosition withOrderKey:(NSString*)orderKey withView:(UIView*) view {
  RNCEKVOrderRelationship* relationship = [_relationships objectForKey: orderKey];
  if(relationship != nil) {
    [relationship update:lastPosition withPosition:position withObject:view];
  }
}

- (void)updateOrderKey:(NSString*)prev next:(NSString*)next position:(NSNumber*)position withView:(UIView*) view {
  if(prev != nil) {
    RNCEKVOrderRelationship* relationship = [_relationships objectForKey: prev];
    if(relationship != nil) {
      [relationship remove: position];
    }
    
    if([relationship isEmpty]) {
      [relationship clear];
      [_relationships removeObjectForKey: prev];
    }
  }
  
  if(next != nil) {
    RNCEKVOrderRelationship* newRelationship = [_relationships objectForKey: next];
    if(newRelationship == nil) {
      newRelationship = [[RNCEKVOrderRelationship alloc] init];
      [_relationships setObject: newRelationship forKey:next];
    }
    [newRelationship add:position withObject:view];
  }
}

- (void)storeOrderId:(NSString*)orderId withView:(UIView*) view {
  [_weakMap setObject:view forKey:orderId];
}

- (UIView*)getOrderView:(NSString*)orderId {
  UIView *view = [_weakMap objectForKey:orderId];
  return view;
};

- (void)cleanOrderId:(NSString*)orderId {
  [_weakMap removeObjectForKey:orderId];
};



@end
