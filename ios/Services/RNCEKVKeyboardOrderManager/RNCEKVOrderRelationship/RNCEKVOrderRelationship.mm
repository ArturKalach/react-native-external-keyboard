//
//  RNCEKVOrderRelationship.m
//
//  Created by Artur Kalach on 13/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNCEKVOrderRelationship.h"
#import "RNCEKVSortedMap.h"

@implementation RNCEKVOrderRelationship {
  RNCEKVSortedMap *_positions;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _positions = [[RNCEKVSortedMap alloc] init];
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

- (void)update:(NSNumber*)lastPosition withPosition:(NSNumber*)position withObject:(NSObject*)obj {
  [_positions update:lastPosition withPosition:position withObject:obj];
}

-(void)clear {
  [_positions clear];
}

-(int)getItemIndex:(UIView*)element  {
  int resultIndex = -1;
  if([self isEmpty]) {
    return resultIndex;
  }
  
  NSArray* order = [_positions getValues];
  for (int i = 0; i < order.count; i++) {
    UIView *orderElement = order[i];
    if (orderElement.subviews[0] == element) { //ToDo focus element
      resultIndex = i;
      break;
    }
  }
  
  return resultIndex;
}

-(UIView*)getItem:(int)index {
  if([self isEmpty]) return nil;
  
  NSArray* order = [_positions getValues];
  BOOL inOrderRange = index >= 0 && index < order.count;
  if(!inOrderRange) return nil;
  
  return order[index];
};

- (NSArray*)getArray {
  return [_positions getValues];
}

-(BOOL)isEmpty {
  return [_positions isEmpty];
}

-(int)count {
  NSArray* order = [_positions getValues];
  return order.count;
}


@end
