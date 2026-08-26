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
  self.entry = nil;
  self.exit = nil;
}

- (int)getItemIndex:(UIView *)element {
  if (element == nil || ![element isKindOfClass:[UIView class]]) return -1;
  NSArray *order = [_positions getValues];
  for (int i = 0; i < (int)order.count; i++) {
    UIView *orderElement = order[i];
    if ([element isDescendantOfView:orderElement]) {
      return i;
    }
  }
  return -1;
}

- (UIView *)getItem:(int)index {
  NSArray *order = [_positions getValues];
  if (index < 0 || index >= (int)order.count) return nil;
  return order[index];
}

- (NSArray *)getArray {
  return [_positions getValues];
}

- (BOOL)isEmpty {
  return [_positions isEmpty];
}

- (int)count {
  return (int)[_positions getValues].count;
}


@end
