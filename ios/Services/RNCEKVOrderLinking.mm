//
//  RNCEKVOrderLinking.m
//  A11yOrder
//
//  Created by Artur Kalach on 13/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNCEKVOrderLinking.h"
#import "RNCEKVRelashioship.h"

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

- (RNCEKVRelashioship*)getInfo:(NSString*)orderGroup {
  RNCEKVRelashioship* relashioship = [_relationships objectForKey: orderGroup];
  return relashioship;
}

- (id)init {
  if (self = [super init]) {
    _relationships = [NSMutableDictionary dictionary];
    _weakMap = [NSMapTable strongToWeakObjectsMapTable];
  }
  
  return self;
}

- (void)add:(NSString*)orderKey withEntry:(UIView*)entry {
  RNCEKVRelashioship* relashioship = [_relationships objectForKey: orderKey];
  if(relashioship != nil) {
    relashioship.entry = entry;
  }
}

- (void)add:(NSString*)orderKey withExit:(UIView*)exit {
  RNCEKVRelashioship* relashioship = [_relationships objectForKey: orderKey];
  if(relashioship != nil) {
    relashioship.exit = exit;
  }
}

- (void)add:(NSNumber*)position withOrderKey:(NSString*)orderKey withObject:(NSObject*)obj {
  RNCEKVRelashioship* relashioship = [_relationships objectForKey: orderKey];
  if(relashioship == nil) {
    relashioship = [[RNCEKVRelashioship alloc] init];
    [_relationships setObject: relashioship forKey:orderKey];
  }
  [relashioship add:position withObject:obj];
}

-(void)remove:(NSNumber*)position withOrderKey:(NSString*)orderKey {
  RNCEKVRelashioship* relashioship = [_relationships objectForKey: orderKey];
  if(relashioship != nil) {
    [relashioship remove:position];
    if([relashioship isEmpty]) {
      [relashioship clear];
      [_relationships removeObjectForKey: orderKey];
    }
  }
}

-(void)setContainer:(NSString*)orderKey withView:(UIView*) view {
  RNCEKVRelashioship* relashioship = [_relationships objectForKey: orderKey];
  if(relashioship != nil) {
    [relashioship setContainer:view];
  }
}

- (void)update:(NSNumber*)position lastPosition:(NSNumber*)lastPosition withOrderKey:(NSString*)orderKey withView:(UIView*) view {
  RNCEKVRelashioship* relashioship = [_relationships objectForKey: orderKey];
  if(relashioship != nil) {
    [relashioship update:lastPosition withPosition:position withObject:view];
  }
}

- (void)updateOrderKey:(NSString*)prev next:(NSString*)next position:(NSNumber*)position withView:(UIView*) view {
  if(prev != nil) {
    RNCEKVRelashioship* relashioship = [_relationships objectForKey: prev];
    if(relashioship != nil) {
      [relashioship remove: position];
    }
    
    if([relashioship isEmpty]) {
      [relashioship clear];
      [_relationships removeObjectForKey: prev];
    }
  }
  
  if(next != nil) {
    RNCEKVRelashioship* newRelashioship = [_relationships objectForKey: next];
    if(newRelashioship == nil) {
      newRelashioship = [[RNCEKVRelashioship alloc] init];
      [_relationships setObject: newRelashioship forKey:next];
    }
    [newRelashioship add:position withObject:view];
  }
}

- (void)removeContainer:(NSString*)orderKey {
  RNCEKVRelashioship* relashioship = [_relationships objectForKey: orderKey];
  if(relashioship != nil) {
    [_relationships removeObjectForKey:orderKey];
  }
}

-(UIView*)getContainer:(NSString*)orderKey withView:(UIView*) view {
  RNCEKVRelashioship* relashioship = [_relationships objectForKey: orderKey];
  if(relashioship != nil) {
    return [relashioship getContainer];
  }
  
  return nil;
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
