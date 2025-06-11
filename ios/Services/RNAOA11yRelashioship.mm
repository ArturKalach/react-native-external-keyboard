//
//  RNAOA11yRelashioship.m
//  A11yOrder
//
//  Created by Artur Kalach on 13/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNAOA11yRelashioship.h"
#import "RNAOSortedMap.h"

@implementation RNAOA11yRelashioship {
    UIView *_container;
    RNAOSortedMap *_positions;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _positions = [[RNAOSortedMap alloc] init];
        _container = nil;
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


@end
