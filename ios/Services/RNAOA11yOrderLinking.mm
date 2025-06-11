//
//  RNAOA11yOrderLinking.m
//  A11yOrder
//
//  Created by Artur Kalach on 13/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNAOA11yOrderLinking.h"
#import "RNAOA11yRelashioship.h"

@implementation RNAOA11yOrderLinking {
    NSMutableDictionary *_relationships;
}

+ (instancetype)sharedInstance {
    static RNAOA11yOrderLinking *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc] init];
    });
    return sharedInstance;
}

- (RNAOA11yRelashioship*)getInfo:(NSString*)orderGroup {
  RNAOA11yRelashioship* relashioship = [_relationships objectForKey: orderGroup];
  return relashioship;
}

- (id)init {
  if (self = [super init]) {
      _relationships = [NSMutableDictionary dictionary];
  }
   
  return self;
}

- (void)add:(NSNumber*)position withOrderKey:(NSString*)orderKey withObject:(NSObject*)obj {
    RNAOA11yRelashioship* relashioship = [_relationships objectForKey: orderKey];
    if(relashioship == nil) {
        relashioship = [[RNAOA11yRelashioship alloc] init];
        [_relationships setObject: relashioship forKey:orderKey];
    }
    [relashioship add:position withObject:obj];
}

-(void)remove:(NSNumber*)position withOrderKey:(NSString*)orderKey {
    RNAOA11yRelashioship* relashioship = [_relationships objectForKey: orderKey];
    if(relashioship != nil) {
        [relashioship remove:position];
    }
}

-(void)setContainer:(NSString*)orderKey withView:(UIView*) view {
    RNAOA11yRelashioship* relashioship = [_relationships objectForKey: orderKey];
    if(relashioship != nil) {
        [relashioship setContainer:view];
    }
}

- (void)update:(NSNumber*)position lastPosition:(NSNumber*)lastPosition withOrderKey:(NSString*)orderKey withView:(UIView*) view {
    RNAOA11yRelashioship* relashioship = [_relationships objectForKey: orderKey];
    if(relashioship != nil) {
        [relashioship update:lastPosition withPosition:position withObject:view];
    }
}

- (void)removeContainer:(NSString*)orderKey {
    RNAOA11yRelashioship* relashioship = [_relationships objectForKey: orderKey];
    if(relashioship != nil) {
        [_relationships removeObjectForKey:orderKey];
        [relashioship clear];
    }
}

-(UIView*)getContainer:(NSString*)orderKey withView:(UIView*) view {
    RNAOA11yRelashioship* relashioship = [_relationships objectForKey: orderKey];
    if(relashioship != nil) {
        return [relashioship getContainer];
    }
    
    return nil;
}


@end
