//
//  RNCEKVRelashioship.m
//
//  Created by Artur Kalach on 13/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNCEKVRelashioship.h"
#import "RNCEKVSortedMap.h"

@implementation RNCEKVRelashioship {
  UIView *_container;
  RNCEKVSortedMap *_positions;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _positions = [[RNCEKVSortedMap alloc] init];
    _container = nil;
    _entry = nil;
    _exit = nil;
  }
  return self;
}

- (void)add:(NSNumber*)position withObject:(NSObject*)obj {
  [_positions put:position withObject:obj];
}

-(void)remove:(NSNumber*)position {
  [_positions remove:position];
}

-(void)setContainer:(UIView*)view {
  _container = view;
}

- (void)update:(NSNumber*)lastPosition withPosition:(NSNumber*)position withObject:(NSObject*)obj {
  [_positions update:lastPosition withPosition:position withObject:obj];
}

-(void)clear {
  [_positions clear];
}

- (NSArray*)getArray {
  return [_positions getValues];
}

-(UIView*)getContainer {
  return _container;
}

-(BOOL)isEmpty {
  return [_positions isEmpty];
}


@end
